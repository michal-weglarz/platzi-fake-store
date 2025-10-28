import {Route, Switch} from "wouter";
import {lazy} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const LoginPage = lazy(() => import('./LoginPage'));
const ProductsPage = lazy(() => import('./ProductsPage'));
const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Switch>
                <Route path="/login" component={LoginPage}/>
                <Route path="/products" component={ProductsPage}/>
                <Route path="/products/new"/>
                <Route path="/products/:id/"/>
                <Route path="/products/:id/edit"/>
                <Route>404: No such page!</Route>
            </Switch>
        </QueryClientProvider>
    )
}

export default App
