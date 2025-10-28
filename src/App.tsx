import {Route, Switch} from "wouter";
import {lazy} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Navbar from "./Navbar.tsx";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

const LoginPage = lazy(() => import('./LoginPage'));
const ProductsPage = lazy(() => import('./ProductsPage'));
const queryClient = new QueryClient(
    {
        defaultOptions: {
            queries: {
                gcTime: 1_000 * 60 * 60 * 24, // 24 hours
            },
        },
    }
)

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Navbar/>
            <main className="max-w-6xl mx-auto">
                <Switch>
                    <Route path="/login" component={LoginPage}/>
                    <Route path="/products" component={ProductsPage}/>
                    <Route path="/products/new"/>
                    <Route path="/products/:id/"/>
                    <Route path="/products/:id/edit"/>
                    <Route>404: No such page!</Route>
                </Switch>
            </main>
            <ReactQueryDevtools initialIsOpen={true}/>
        </QueryClientProvider>
    )
}

export default App
