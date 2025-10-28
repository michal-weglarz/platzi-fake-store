import {useQuery} from "@tanstack/react-query";

type Category = {
    id: number;
    name: string;
    slug: string;
    image: string;
    creationAt: string;
    updatedAt: string;
};

type Product = {
    id: number;
    title: string;
    slug: string;
    price: number;
    description: string;
    category: Category;
    images: string[];
    creationAt: string;
    updatedAt: string;
};

function ProductsPage() {
    const query = useQuery({
        queryKey: ['products'],
        queryFn: async (): Promise<Array<Product>> => {
            const response = await fetch("https://api.escuelajs.co/api/v1/products");
            return await response.json()
        },
    })

    if (query.isLoading) {
        return "Loading..."
    }
    if (query.data) {
        return (
            <ul>
                {query.data.map(product => (
                    <li key={product.id}>{product.title}</li>
                ))}
            </ul>
        )
    }
    return 'error';

}

export default ProductsPage;