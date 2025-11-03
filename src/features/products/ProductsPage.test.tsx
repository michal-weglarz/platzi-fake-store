import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductsPage from "./ProductsPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSearchParams } from "wouter";

vi.mock("wouter", async (importOriginal) => {
	const actual: any = await importOriginal();
	return {
		...actual,
		useSearchParams: vi.fn(),
	};
});

const mockUseSearchParams = vi.mocked(useSearchParams);

describe("ProductsPage", () => {
	test("renders correctly", () => {
		const mockPath = new URLSearchParams("/products");
		mockUseSearchParams.mockReturnValue([mockPath, vi.fn()]);
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});
		queryClient.setQueryData(["products", 1, 10], {
			total: 2,
			products: [{ id: 1, title: "Test Product", images: [], category: { name: "Test" } }],
		});
		queryClient.setQueryData(["categories"], [{ id: 1, slug: "electronics" }]);
		render(
			<QueryClientProvider client={queryClient}>
				<ProductsPage />
			</QueryClientProvider>
		);
		expect(screen.getByRole("heading", { name: "Products" })).toBeDefined();
	});

	test("displays the error message when the url params are incorrect", () => {
		const mockPath = new URLSearchParams("page=-99");
		mockUseSearchParams.mockReturnValue([mockPath, vi.fn()]);
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});
		queryClient.setQueryData(["products", -99, 10], {
			total: 2,
			products: [{ id: 1, title: "Test Product", images: [], category: { name: "Test Category" } }],
		});
		queryClient.setQueryData(["categories"], [{ id: 1, slug: "electronics" }]);
		render(
			<QueryClientProvider client={queryClient}>
				<ProductsPage />
			</QueryClientProvider>
		);
		expect(screen.getByText("An error occurred!")).toBeDefined();
		expect(screen.getByText("Invalid URL parameters.")).toBeDefined();
	});

	test("displays the loading state", () => {
		const mockPath = new URLSearchParams("");
		mockUseSearchParams.mockReturnValue([mockPath, vi.fn()]);
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		render(
			<QueryClientProvider client={queryClient}>
				<ProductsPage />
			</QueryClientProvider>
		);
		expect(document.querySelectorAll(".skeleton").length).toBeGreaterThan(0);
	});
});
