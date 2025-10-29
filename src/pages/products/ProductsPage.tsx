import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {type ChangeEvent} from "react";
import {useSearchParams} from "wouter";
import Pagination from "./Pagination.tsx";
import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE} from "../../utils/consts.ts";
import type {Product} from "../../utils/types.ts";


function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') ?? "0") ?? DEFAULT_PAGE;
    const pageSize = parseInt(searchParams.get('pageSize') ?? "0") ?? DEFAULT_PAGE_SIZE;


    const query = useQuery({
            queryKey: ['products', page, pageSize],
            queryFn: async () => {
                const offset = page * pageSize;

                const [all, paginated] = await Promise.all([
                    // This call is required for pagination. Ideally the `proucts` endpoint should return total number of all available products.
                    fetch(`https://api.escuelajs.co/api/v1/products`).then(res => res.json() as Promise<Product[]>),
                    fetch(`https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${pageSize}`).then(res => res.json() as Promise<Product[]>),
                ])

                return {
                    total: all.length,
                    products: paginated
                }

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
            // It makes sense to reset the selected page when changing the size to avoid an empty page.
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
                    page={page}
                    pageSize={pageSize}
                    changeSelectedPageSize={changeSelectedPageSize}
                    changeSelectedPage={changeSelectedPage}
                    total={query.data.total}
                />
                <ul className="list bg-base-100 rounded-box shadow-md w-full">
                    <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                        {(page) * pageSize + 1}-{Math.min((page + 1) * pageSize, query.data.total)} out
                        of {query.data.total}
                    </li>
                    {query.data.products
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
                <Pagination
                    page={page}
                    pageSize={pageSize}
                    changeSelectedPageSize={changeSelectedPageSize}
                    changeSelectedPage={changeSelectedPage}
                    total={query.data.total}
                />
            </div>
        )
    }


    return null
}

export default ProductsPage;