import {useQuery} from "@tanstack/react-query";

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
    creationAt: string;
    updatedAt: string;
};

interface Product {
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

        },
    )

    if (query.isLoading) {
        return (
            <>
                <h1 className="p-4 pb-2 text-3xl font-bold tracking-wide">Products</h1>
                <ul className="list bg-base-100 rounded-box shadow-md">
                    <li className="list-row">
                        <div className="skeleton h-48 w-48"></div>
                        <div className={"flex flex-col gap-4"}>
                            <div className="skeleton h-4 w-64"></div>
                            <div className="skeleton h-8 w-full"></div>
                        </div>
                    </li>
                    <li className="list-row">
                        <div className="skeleton h-48 w-48"></div>
                        <div className={"flex flex-col gap-4"}>
                            <div className="skeleton h-4 w-64"></div>
                            <div className="skeleton h-8 w-full"></div>
                        </div>
                    </li>
                    <li className="list-row">
                        <div className="skeleton h-48 w-48"></div>
                        <div className={"flex flex-col gap-4"}>
                            <div className="skeleton h-4 w-64"></div>
                            <div className="skeleton h-8 w-full"></div>
                        </div>
                    </li>
                </ul>
            </>
        )
    }
    if (query.error) {
        return 'error';
    }
    if (query.data) {
        return (
            <>
                <h1 className="p-4 pb-2 text-3xl font-bold tracking-wide">Products</h1>
                <ul className="list bg-base-100 rounded-box shadow-md">
                    {query.data
                        .map(product => (
                            <li key={product.id} className="list-row">

                                <figure className="hover-gallery max-w-48">
                                    {product.images.length > 1 ?
                                        product.images.map(image => (
                                            <img className="size-48 rounded-box" src={image} alt={product.title}/>
                                        )) :
                                        <img className="size-48 rounded-box" src={product.images[0]}
                                             alt={product.title}/>}
                                </figure>

                                <div className={"flex flex-row gap-4"}>
                                    <div className="flex flex-col gap-2 list-col-wrap">
                                        <p className="text-xl">{product.title}</p>
                                        <div className="text-xs uppercase font-semibold opacity-60">
                                            {product.category.name}
                                        </div>
                                        <p className="text-xs opacity-60">
                                            {product.description}
                                        </p>
                                    </div>
                                    <div
                                        className={"flex w-fit min-w-16 font-semibold text-lg"}>${product.price}</div>
                                </div>
                            </li>
                        ))}
                </ul>
            </>
        )
    }


    return null
}

export default ProductsPage;