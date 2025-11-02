import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type ChangeEvent } from "react";
import { Link, useSearchParams } from "wouter";
import Pagination from "./Pagination.tsx";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT_BY } from "../../utils/consts.ts";
import type { Product, SortBy } from "../../utils/types.ts";
import { ArrowDownIcon, ArrowUpIcon, EditIcon, EyeIcon, PlusIcon, SearchIcon } from "../../components/Icons.tsx";
import { debounce } from "../../utils/utils.ts";
import api from "../../utils/api.ts";
import { useAuth } from "../../utils/useAuth.ts";
import DeleteProductButton from "./DeleteProductButton.tsx";
import PageError from "../../components/PageError.tsx";
import ProductsLoadingSkeleton from "./ProductsLoadingSkeleton.tsx";
import PageHeader from "./PageHeader.tsx";

function ProductsPage() {
	const auth = useAuth();
	const [searchParams, setSearchParams] = useSearchParams();
	const pageParam = searchParams.get("page");
	const pageSizeParam = searchParams.get("pageSize");

	const page = pageParam ? parseInt(pageParam) : DEFAULT_PAGE;
	const pageSize = pageSizeParam ? parseInt(pageSizeParam) : DEFAULT_PAGE_SIZE;
	const sortBy = (searchParams.get("sortBy") ?? DEFAULT_SORT_BY) as SortBy;
	const title = searchParams.get("title") ?? "";
	const category = searchParams.get("category") ?? "";
	const priceMin = searchParams.get("priceMin") ?? "";
	const priceMax = searchParams.get("priceMax") ?? "";

	const productsQuery = useQuery({
		queryKey: ["products", page, pageSize, title, category, priceMin, priceMax].filter(Boolean),
		queryFn: async () => {
			const offset = Math.max((page - 1) * pageSize, 0); // in case `page` is negative
			const [all, paginated] = await Promise.all([
				// All products for total count used in pagination
				api.products.getAll({
					title,
					categorySlug: category,
					price_min: priceMin,
					price_max: priceMax,
				}),
				// Paginated products
				api.products.getAll({
					offset,
					limit: pageSize,
					title,
					categorySlug: category,
					price_min: priceMin,
					price_max: priceMax,
				}),
			]);

			return {
				total: all.length,
				products: paginated,
			};
		},
		gcTime: 10_000, // inactive query gets removed from the cache after 10s
		placeholderData: keepPreviousData,
	});

	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: () => api.categories.getAll(),
	});

	const isPageLoading = productsQuery.isLoading || categoriesQuery.isLoading;
	const isPageError = productsQuery.isError || categoriesQuery.isError;

	const changeSelectedPage = (page: number) => {
		setSearchParams((prev) => {
			prev.set("page", page.toString());
			return prev;
		});
	};

	const changeSelectedPageSize = (event: ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;

		setSearchParams((prev) => {
			prev.set("page", "1");
			prev.set("pageSize", value);
			return prev;
		});
	};

	const setSortBy = (value: SortBy) => {
		setSearchParams((prev) => {
			prev.set("sortBy", value);
			return prev;
		});
	};

	const sortProducts = (a: Product, b: Product) => {
		if (sortBy === "title-asc") {
			return a.title.localeCompare(b.title);
		}
		if (sortBy === "title-desc") {
			return b.title.localeCompare(a.title);
		}
		if (sortBy === "category-asc") {
			return a.category.name.localeCompare(b.category.name);
		}
		if (sortBy === "category-desc") {
			return b.category.name.localeCompare(a.category.name);
		}
		if (sortBy === "price-asc") {
			return a.price - b.price;
		}
		if (sortBy === "price-desc") {
			return b.price - a.price;
		}
		return 0;
	};

	const changeSelectedCategory = (event: ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		if (value.length === 0) {
			setSearchParams((prev) => {
				prev.delete("category");
				return prev;
			});
		} else {
			setSearchParams((prev) => {
				prev.set("page", "1");
				prev.set("category", value);
				return prev;
			});
		}
	};

	const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (value.length === 0) {
			setSearchParams((prev) => {
				prev.delete("title");
				return prev;
			});
		} else {
			setSearchParams((prev) => {
				prev.set("page", "1");
				prev.set("title", value);
				return prev;
			});
		}
	};

	const updatePriceMin = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (value.length === 0) {
			setSearchParams((prev) => {
				prev.delete("priceMin");
				return prev;
			});
		} else {
			setSearchParams((prev) => {
				prev.set("page", "1");
				prev.set("priceMin", value);
				return prev;
			});
		}
	};

	const updatePriceMax = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (value === "" || parseInt(value) < 0) {
			setSearchParams((prev) => {
				prev.delete("priceMax");
				return prev;
			});
		} else {
			setSearchParams((prev) => {
				prev.set("page", "1");
				prev.set("priceMax", value);
				return prev;
			});
		}
	};

	const resetFilters = () => {
		setSearchParams((prev) => {
			prev.delete("category");
			prev.delete("title");
			prev.delete("priceMin");
			prev.delete("priceMax");
			return prev;
		});

		// I'm using an imperative approach with the pure JavaScript API, because I find it easier to reset the following
		// inputs' values like this, instead of making the inputs controlled by React and dealing with synchronization of
		// the local state to the url params.
		// Search, Min price and Max price trigger URL changes either in the debounced manner or on blur—I can't simply
		// use `value={searchParams.get("title")}` like I did with the Category filter.
		const search: HTMLInputElement | null = document.querySelector("#search");
		const minPrice: HTMLInputElement | null = document.querySelector("#min-price");
		const maxPrice: HTMLInputElement | null = document.querySelector("#max-price");
		if (search) search.value = "";
		if (minPrice) minPrice.value = "";
		if (maxPrice) maxPrice.value = "";
	};

	const debounceSearchChange = debounce(onSearchChange, 300);

	if (isPageLoading) {
		return <ProductsLoadingSkeleton />;
	}

	if (isPageError) {
		return <PageError message={"Couldn't load the requested resources."} />;
	}

	if (productsQuery.data && categoriesQuery.data) {
		const areParamsValid = pageSize > 0 && page > 0;

		if (!areParamsValid) {
			return <PageError message={"Invalid URL parameters."} />;
		}

		return (
			<div className={"flex flex-col gap-6 items-end"}>
				<PageHeader
					breadcrumbs={[{ name: "Home", link: "/" }, { name: "Products" }]}
					title={"Products"}
					actionButton={
						auth.user != null ? (
							<div className={"flex"}>
								<Link to={"/products/new"} className={"btn btn-neutral btn-sm max-md:w-full"}>
									<PlusIcon />
									<span>Add new product</span>
								</Link>
							</div>
						) : null
					}
				/>

				{/* Main content area */}
				<div className="card bg-base-100 w-full shadow-sm">
					<div className={"flex flex-col-reverse md:flex-row gap-4 sm:justify-between items-center"}>
						<div className={"flex flex-col md:flex-row gap-3 p-4 sm:justify-between w-full"}>
							<label className="input input-sm w-full floating-label">
								<SearchIcon />
								<input
									id={"search"}
									type="search"
									placeholder="Search title"
									defaultValue={title ?? ""}
									onChange={debounceSearchChange}
								/>
								<span>Search title</span>
							</label>

							<select
								className="select select-sm w-full "
								value={category}
								onChange={changeSelectedCategory}
							>
								<option disabled>Category</option>
								<option key={"all"} value={""}>
									All categories
								</option>
								{categoriesQuery.data.map((category) => (
									<option key={category.id} value={category.slug}>
										{category.name}
									</option>
								))}
							</select>

							<div className={"flex flex-row gap-1 w-full"}>
								<label className="input input-sm floating-label w-full">
									<input
										id={"min-price"}
										type="number"
										min="1"
										placeholder="Min price"
										defaultValue={priceMin}
										onBlur={updatePriceMin}
									/>
									<span>Min price</span>
								</label>
								<label className="input input-sm floating-label w-full">
									<input
										id={"max-price"}
										type="number"
										min="1"
										placeholder="Max price"
										defaultValue={priceMax}
										onBlur={updatePriceMax}
									/>
									<span>Max price</span>
								</label>
							</div>

							<button className={"btn btn-ghost btn-sm"} onClick={resetFilters}>
								Reset
								<span className={"visible sm:hidden"}>filters</span>
							</button>
						</div>
					</div>

					<div className="card-body">
						<div className="overflow-x-auto">
							<table className="table">
								<thead>
									<tr>
										<th
											className={"hover:cursor-pointer hover:bg-slate-50"}
											role={"button"}
											onClick={() => {
												if (sortBy === "title-asc") {
													setSortBy("title-desc");
												} else {
													setSortBy("title-asc");
												}
											}}
										>
											<div className={"flex flex-row gap-2 items-center"}>
												Title
												{sortBy === "title-asc" && <ArrowUpIcon />}
												{sortBy === "title-desc" && <ArrowDownIcon />}
											</div>
										</th>
										<th
											className={"hover:cursor-pointer hover:bg-slate-50"}
											onClick={() => {
												if (sortBy === "category-asc") {
													setSortBy("category-desc");
												} else {
													setSortBy("category-asc");
												}
											}}
										>
											<div className={"flex flex-row gap-2 items-center"}>
												Category
												{sortBy === "category-asc" && <ArrowUpIcon />}
												{sortBy === "category-desc" && <ArrowDownIcon />}
											</div>
										</th>
										<th
											className={"hover:cursor-pointer hover:bg-slate-50"}
											onClick={() => {
												if (sortBy === "price-asc") {
													setSortBy("price-desc");
												} else {
													setSortBy("price-asc");
												}
											}}
										>
											<div className={"flex flex-row gap-2 items-center"}>
												Price
												{sortBy === "price-asc" && <ArrowUpIcon />}
												{sortBy === "price-desc" && <ArrowDownIcon />}
											</div>
										</th>
										<th className={"w-[100px]"}>Action</th>
									</tr>
								</thead>
								<tbody>
									{productsQuery.data.products.length === 0 && (
										<tr>
											<td colSpan={4}>
												<div className={"flex flex-row justify-center items-center"}>
													No product found
												</div>
											</td>
										</tr>
									)}
									{productsQuery.data.products.sort(sortProducts).map((product) => (
										<tr key={product.id}>
											<td>
												<div className="flex items-center gap-3">
													<div className="avatar">
														<div className="mask h-12 w-12">
															<img src={product.images[0]} alt="Product image" />
														</div>
													</div>
													<div>
														<div className="font-bold line-clamp-1">
															<Link
																to={`/products/${product.id}`}
																className="font-bold line-clamp-1 hover:underline"
															>
																{product.title}
															</Link>
														</div>
														<span className="badge badge-ghost badge-sm">
															#{product.id}
														</span>
													</div>
												</div>
											</td>
											<td>{product.category.name}</td>
											<td>${product.price}</td>
											<th>
												{auth.user && (
													<div className="flex flex-row gap-2 items-center ">
														<div className="tooltip" data-tip="Edit">
															<Link
																className={"btn btn-sm btn-square btn-ghost"}
																to={`/products/${product.id}/edit`}
															>
																<EditIcon />
															</Link>
														</div>

														<div className="tooltip" data-tip="See details">
															<Link
																className={"btn btn-sm btn-square btn-ghost"}
																to={`/products/${product.id}`}
															>
																<EyeIcon />
															</Link>
														</div>

														<DeleteProductButton product={product} />
													</div>
												)}
											</th>
										</tr>
									))}
								</tbody>
								<tfoot>
									<tr>
										<td colSpan={4}>
											<Pagination
												page={page}
												pageSize={pageSize}
												changeSelectedPageSize={changeSelectedPageSize}
												changeSelectedPage={changeSelectedPage}
												total={productsQuery.data.total}
												productsOnPage={productsQuery.data.products.length}
											/>
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return <PageError />;
}

export default ProductsPage;
