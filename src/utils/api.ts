import axios from "axios";
import type {
	AuthResponse,
	Category,
	CreateProductData,
	LoginCredentials,
	Product,
	ProductsQueryParams,
	RegisterData,
	UpdateProductData,
	User,
} from "./types.ts";

const apiConfig = axios.create({
	baseURL: "https://api.escuelajs.co/api/v1/",
});

apiConfig.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("authToken");
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
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("authToken");
			window.location.href = "/login";
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
			if (params?.offset !== undefined) searchParams.set("offset", params.offset.toString());
			if (params?.limit) searchParams.set("limit", params.limit.toString());

			const response = await apiConfig.get(`/products?${searchParams.toString()}`);
			return response.data;
		},

		getById: async (id: number): Promise<Product> => {
			const response = await apiConfig.get<Product>(`/products/${id}`);
			return response.data;
		},

		create: async (productData: CreateProductData): Promise<Product> => {
			const response = await apiConfig.post<Product>("/products", productData);
			return response.data;
		},

		update: async (id: number, productData: UpdateProductData): Promise<Product> => {
			const response = await apiConfig.put<Product>(`/products/${id}`, productData);
			return response.data;
		},

		delete: async (id: number): Promise<boolean> => {
			const response = await apiConfig.delete<boolean>(`/products/${id}`);
			return response.data;
		},
	},

	// Categories endpoints
	categories: {
		getAll: async (): Promise<Category[]> => {
			const response = await apiConfig.get<Category[]>("/categories");
			return response.data;
		},

		getById: async (id: number): Promise<Category> => {
			const response = await apiConfig.get<Category>(`/categories/${id}`);
			return response.data;
		},
	},

	// Auth endpoints
	auth: {
		login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
			const response = await apiConfig.post<AuthResponse>("/auth/login", credentials);
			return response.data;
		},

		register: async (userData: RegisterData): Promise<User> => {
			const response = await apiConfig.post<User>("/auth/register", userData);
			return response.data;
		},

		logout: async (): Promise<void> => {
			localStorage.removeItem("authToken");
			window.location.href = "/login";
		},
	},
};

export default api;
