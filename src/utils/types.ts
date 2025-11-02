export interface Category {
	id: number;
	name: string;
	slug: string;
	image: string;
	creationAt: string;
	updatedAt: string;
}

export interface Product {
	id: number;
	title: string;
	slug: string;
	price: number;
	description: string;
	category: Category;
	images: string[];
	creationAt: string;
	updatedAt: string;
}

export type SortBy =
	| "default"
	| "title-asc"
	| "title-desc"
	| "category-asc"
	| "category-desc"
	| "price-asc"
	| "price-desc";

export interface User {
	id: number;
	email: string;
	password: string;
	name: string;
	role: string;
	avatar: string;
}

export interface ProductsQueryParams {
	title?: string;
	categorySlug?: string;
	price_min?: string;
	price_max?: string;
	offset?: number;
	limit?: number;
}

export interface CreateProductData {
	title: string;
	price: number;
	description: string;
	categoryId: number;
	images: string[];
}

export interface UpdateProductData {
	title?: string;
	price?: number;
	description?: string;
	category?: Category;
	categoryId?: number;
	images?: string[];
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface AuthResponse {
	access_token: string;
	refresh_token: string;
}

export interface AuthContextType {
	user?: User | null;
}

export interface FileUploadResponse {
	filename: string;
	location: string;
	originalname: string;
}
