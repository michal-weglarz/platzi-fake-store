import axios from "axios";
import type {
	AuthResponse,
	Category,
	CreateProductData,
	FileUploadResponse,
	LoginCredentials,
	Product,
	ProductsQueryParams,
	UpdateProductData,
	User,
} from "./types.ts";
import { isTokenExpiringSoon } from "./utils.ts";

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
	const refreshToken = localStorage.getItem("refresh_token");
	if (!refreshToken) {
		throw new Error("Refresh token is missing");
	}

	// Direct axios call to avoid interceptor and prevent infinite loops
	const response = await axios.post<AuthResponse>("https://api.escuelajs.co/api/v1/auth/refresh-token", {
		refreshToken: refreshToken,
	});

	localStorage.setItem("access_token", response.data.access_token);
	localStorage.setItem("refresh_token", response.data.refresh_token);

	return response.data.access_token;
};

const apiConfig = axios.create({
	baseURL: "https://api.escuelajs.co/api/v1/",
});

apiConfig.interceptors.request.use(
	async (config) => {
		// Note: access token shouldn't really be stored on the client side at all. Ideally we'd pass it around in a
		// httponly cookie, which is inaccessible from JavaScript, and therefore prevents XSS attacks.
		// For the sake of brevity and having in mind this is merely a demo app, I'm going to use `localStorage` here.
		// Otherwise, I'd have set up an additional proxy server (or e.g. use the BFF pattern).
		const storedAccessToken = localStorage.getItem("access_token");
		if (storedAccessToken) {
			config.headers.Authorization = `Bearer ${storedAccessToken}`;

			// The api docs say that "The access token is valid for 20 days, and the refresh token is valid for 10 hours."
			// (see: https://fakeapi.platzi.com/en/rest/auth-jwt/#refreshing-access-token).
			// This doesn't seem to make sense as it renders the refresh token virtually useless.
			// However, I still implemented a sample refresh flow, just for the demonstration purposes.
			// By tweaking the `bufferSeconds` below and setting it to some large values we can test it in action.
			// E.g, 1_728_000 is equal to 20 days
			if (isTokenExpiringSoon(storedAccessToken, 60)) {
				if (isRefreshing && refreshPromise) {
					try {
						const newToken = await refreshPromise;
						config.headers.Authorization = `Bearer ${newToken}`;
						return config;
					} catch (error) {
						return Promise.reject(error);
					}
				}

				// Start new refresh
				isRefreshing = true;
				refreshPromise = refreshAccessToken()
					.then((newToken) => {
						isRefreshing = false;
						refreshPromise = null;
						return newToken;
					})
					.catch((error) => {
						isRefreshing = false;
						refreshPromise = null;
						localStorage.removeItem("access_token");
						localStorage.removeItem("refresh_token");
						throw error;
					});

				try {
					const newToken = await refreshPromise;
					config.headers.Authorization = `Bearer ${newToken}`;
					return config;
				} catch (error) {
					return Promise.reject(error);
				}
			}
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor acts as a safety net:
// - Handles edge cases where proactive refresh didn't trigger
// - Ensures failed requests are retried with fresh tokens
apiConfig.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			if (isRefreshing && refreshPromise) {
				try {
					const newToken = await refreshPromise;
					originalRequest.headers.Authorization = `Bearer ${newToken}`;
					return apiConfig(originalRequest);
				} catch (refreshError) {
					localStorage.removeItem("access_token");
					localStorage.removeItem("refresh_token");
					return Promise.reject(refreshError);
				}
			}

			// Start new refresh
			isRefreshing = true;
			refreshPromise = refreshAccessToken()
				.then((newToken) => {
					isRefreshing = false;
					refreshPromise = null;
					return newToken;
				})
				.catch((error) => {
					isRefreshing = false;
					refreshPromise = null;
					localStorage.removeItem("access_token");
					localStorage.removeItem("refresh_token");
					throw error;
				});

			try {
				const newToken = await refreshPromise;
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return apiConfig(originalRequest);
			} catch (error) {
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
			localStorage.removeItem("refresh_token");
		},

		getProfile: async () => {
			const response = await apiConfig.get<User>(`/auth/profile`);
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
