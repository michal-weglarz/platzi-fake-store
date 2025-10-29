import {Route, Switch} from "wouter";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Navbar from "./components/Navbar.tsx";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {lazy, Suspense} from "react";
import PageLoading from "./components/PageLoading.tsx";

const LoginPage = lazy(() => import('./pages/login/LoginPage.tsx'));
const ProductsPage = lazy(() => import('./pages/products/ProductsPage.tsx'));


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
            <Navbar/>
            <main className="max-w-5xl mx-auto">
                <Switch>
                    <Route path="/login">
                        <Suspense fallback={<PageLoading/>}>
                            <LoginPage/>
                        </Suspense>
                    </Route>
                    <Route path="/products">
                        <Suspense fallback={<PageLoading/>}>
                            <ProductsPage/>
                        </Suspense>
                    </Route>
                    <Route path="/products/new"/>
                    <Route path="/products/:id/"/>
                    <Route path="/products/:id/edit"/>
                    <Route>404: No such page!</Route>
                </Switch>
            </main>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}

export default App
