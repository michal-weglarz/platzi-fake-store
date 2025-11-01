import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy, Suspense } from "react";
import PageLoading from "./components/PageLoading.tsx";
import { AuthProvider } from "./components/AuthContext.tsx";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import NotFoundPage from "./components/NotFoundPage.tsx";

const LoginPage = lazy(() => import("./pages/login/LoginPage.tsx"));
const ProductsPage = lazy(() => import("./pages/products/ProductsPage.tsx"));
const AddNewProductPage = lazy(() => import("./pages/products/AddNewProductPage.tsx"));

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1_000, // 5 min
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<Navbar />
				<main className="max-w-6xl mx-auto pt-24 px-4 pb-20 bg-slate-50">
					<Switch>
						<Route path="/login">
							<Suspense fallback={<PageLoading />}>
								<LoginPage />
							</Suspense>
						</Route>
						<Route path="/products">
							<Suspense fallback={<PageLoading />}>
								<ProductsPage />
							</Suspense>
						</Route>
						<Route path="/products/new">
							<Suspense fallback={<PageLoading />}>
								<ProtectedRoute>
									<AddNewProductPage />
								</ProtectedRoute>
							</Suspense>
						</Route>
						<Route path="/products/new" />
						<Route path="/products/:id/" />
						<Route path="/products/:id/edit" />
						<Route>
							<NotFoundPage />
						</Route>
					</Switch>
				</main>
				<ToastContainer position="bottom-left" />
			</AuthProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;
