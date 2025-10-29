import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {type ChangeEvent} from "react";
import {useSearchParams} from "wouter";
import PageLoading from "../../components/PageLoading.tsx";
import Pagination from "./Pagination.tsx";

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

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 0;


function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') ?? DEFAULT_PAGE.toString();
    const pageSize = searchParams.get('pageSize') ?? DEFAULT_PAGE_SIZE.toString();


    const query = useQuery({
            queryKey: ['products', page, pageSize],
            queryFn: async (): Promise<Array<Product>> => {
                const offset = parseInt(page) * parseInt(pageSize);
                const response = await fetch(`https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${pageSize}`);
                return await response.json()
            },
            placeholderData: keepPreviousData,
        },
    )

    const changeSelectedPage = (page: number) => {
        setSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        })
    }

    const changeSelectedPageSize = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSearchParams({
            // It makes sense to reset the selected page when changing the size to avoid a blank page.
            page: "0",
            pageSize: value,
        })
    }

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
            <div className={"flex flex-col gap-4 items-end p-4"}>
                <h1 className="p-4 pb-2 text-3xl font-bold tracking-wide self-start">Products</h1>
                <Pagination
                    page={parseInt(page)}
                    pageSize={parseInt(pageSize)}
                    changeSelectedPageSize={changeSelectedPageSize}
                    changeSelectedPage={changeSelectedPage}
                />
                <ul className="list bg-base-100 rounded-box shadow-md w-full">
                    {query.data
                        .map(product => (
                            <li key={product.id} className="list-row">

                                {product.images.length > 1 &&
                                    <figure className="hover-gallery max-w-48">
                                        {product.images.map(image => (
                                            <img className="size-48 rounded-box" src={image} alt={product.title}/>
                                        ))}
                                    </figure>}

                                {product.images.length === 1 &&
                                    <img className="size-48 rounded-box" src={product.images[0]}
                                         alt={product.title}/>}

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
                {/*Pagination*/}
                <Pagination
                    page={parseInt(page)}
                    pageSize={parseInt(pageSize)}
                    changeSelectedPageSize={changeSelectedPageSize}
                    changeSelectedPage={changeSelectedPage}
                />
            </div>
        )
    }


    return null
}

export default ProductsPage;