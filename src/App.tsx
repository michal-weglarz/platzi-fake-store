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
const ProductFormPage = lazy(() => import("./pages/products/./ProductFormPage"));
const ProductDetailsPage = lazy(() => import("./pages/products/ProductDetailsPage.tsx"));

const queryClient = new QueryClient();

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
									<ProductFormPage />
								</ProtectedRoute>
							</Suspense>
						</Route>
						<Route path="/products/:id">
							<Suspense fallback={<PageLoading />}>
								<ProductDetailsPage />
							</Suspense>
						</Route>
						<Route path="/products/:id/edit">
							<Suspense fallback={<PageLoading />}>
								<ProtectedRoute>
									<ProductFormPage />
								</ProtectedRoute>
							</Suspense>
						</Route>
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
