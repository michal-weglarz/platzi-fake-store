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
            staleTime: Infinity,
        },
    )

    if (query.isLoading) {
        return "Loading..."
    }
    if (query.data) {
        return (
            <>
                <h1 className="p-4 pb-2 text-3xl font-bold tracking-wide">Products</h1>
                <ul className="list bg-base-100 rounded-box shadow-md">
                    {query.data
                        .map(product => (
                            <li key={product.id} className="list-row">
                                <img className="size-48 rounded-box" src={product.images[0]} alt={product.title}/>
                                <div className={"flex flex-row gap-4"}>
                                    <div className="flex flex-col gap-2 w-fit list-col-wrap">
                                        <p className="text-xl">{product.title}</p>
                                        <p className="text-xs opacity-60">
                                            {product.description}
                                        </p>
                                    </div>
                                    <div className={"flex w-fit min-w-16 font-semibold text-lg"}>${product.price}</div>
                                </div>
                            </li>
                        ))}
                </ul>
            </>
        )
    }
    return 'error';

}

export default ProductsPage;