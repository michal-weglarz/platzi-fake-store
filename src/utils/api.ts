import axios from "axios";
import type {
	AuthResponse,
	Category,
	CreateProductData,
	FileUploadResponse,
	LoginCredentials,
	Product,
	ProductsQueryParams,
	RefreshTokenRequest,
	UpdateProductData,
	User,
} from "./types.ts";

const apiConfig = axios.create({
	baseURL: "https://api.escuelajs.co/api/v1/",
});

apiConfig.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("access_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

apiConfig.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const refreshToken = localStorage.getItem("refresh_token");
				if (!refreshToken) {
					throw new Error("Refresh token is missing");
				}

				const response = await api.auth.refresh({ refresh_token: refreshToken });

				localStorage.setItem("access_token", response.access_token);
				localStorage.setItem("refresh_token", response.refresh_token);

				apiConfig.defaults.headers.Authorization = `Bearer ${response.access_token}`;
				return apiConfig(originalRequest); // Retry the original request with the new access token.
			} catch (error) {
				console.error("Token refresh failed:", error);
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
				return Promise.reject(error);
			}
		}
		return Promise.reject(error);
	}
);

const api = {
	// Products endpoints
	products: {
		getAll: async (params?: ProductsQueryParams): Promise<Product[]> => {
			const searchParams = new URLSearchParams();
			if (params?.title) searchParams.set("title", params.title);
			if (params?.categorySlug) searchParams.set("categorySlug", params.categorySlug);
			if (params?.price_min) searchParams.set("price_min", params.price_min);
			if (params?.price_max) searchParams.set("price_max", params.price_max);
			if (params?.offset != null) searchParams.set("offset", params.offset.toString());
			if (params?.limit) searchParams.set("limit", params.limit.toString());

			const response = await apiConfig.get(`/products?${searchParams.toString()}`);
			return response.data;
		},

		getById: async (id: number) => {
			const response = await apiConfig.get<Product>(`/products/${id}`);
			return response.data;
		},

		create: async (productData: CreateProductData) => {
			const response = await apiConfig.post<Product>("/products", productData);
			return response.data;
		},

		update: async (id: number, productData: UpdateProductData) => {
			const response = await apiConfig.put<Product>(`/products/${id}`, productData);
			return response.data;
		},

		delete: async (id: number) => {
			const response = await apiConfig.delete<boolean>(`/products/${id}`);
			return response.data;
		},
	},

	// Categories endpoints
	categories: {
		getAll: async () => {
			const response = await apiConfig.get<Category[]>("/categories");
			return response.data;
		},
	},

	// Auth endpoints
	auth: {
		login: async (credentials: LoginCredentials) => {
			const response = await apiConfig.post<AuthResponse>("/auth/login", credentials);
			return response.data;
		},

		logout: async () => {
			localStorage.removeItem("access_token");
		},

		getProfile: async () => {
			const response = await apiConfig.get<User>(`/auth/profile`);
			return response.data;
		},

		refresh: async (data: RefreshTokenRequest) => {
			const response = await apiConfig.post<AuthResponse>(`/auth/refresh`, data);
			return response.data;
		},
	},

	// Files endpoints
	files: {
		uploadMultiple: async (files: File[]) => {
			const uploadPromises = files.map((file) => {
				const formData = new FormData();
				formData.append("file", file);
				return apiConfig.post<FileUploadResponse>("/files/upload", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
			});

			const responses = await Promise.all(uploadPromises);
			return responses.map((res) => res.data);
		},
	},
};

export default api;
