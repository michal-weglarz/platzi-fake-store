import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type ChangeEvent } from "react";
import { Link, useSearchParams } from "wouter";
import Pagination from "./Pagination.tsx";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT_BY } from "../../utils/consts.ts";
import type { Product, SortBy } from "../../utils/types.ts";
import { EditIcon, PlusIcon, SearchIcon } from "../../components/Icons.tsx";
import { debounce } from "../../utils/utils.ts";
import api from "../../utils/api.ts";
import { useAuth } from "../../utils/useAuth.ts";
import DeleteProductButton from "./DeleteProductButton.tsx";

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
			const offset = Math.max((page - 1) * pageSize, 0);
			console.log("offset", offset);
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
		// for dev
		// staleTime: Infinity,
		// gcTime: Infinity,
		// gcTime: 10_000, // inactive query gets removed from the cache after 10s
		placeholderData: keepPreviousData,
	});

	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			return api.categories.getAll();
		},
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

	const setSortBy = (event: ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;

		setSearchParams((prev) => {
			prev.set("sortBy", value);
			return prev;
		});
	};

	const sortProducts = (a: Product, b: Product) => {
		if (sortBy === "title") {
			return a.title.localeCompare(b.title);
		}
		if (sortBy === "category") {
			return a.category.name.localeCompare(b.category.name);
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

		setSearchParams((prev) => {
			prev.set("page", "1");
			prev.set("category", value);
			return prev;
		});
	};

	const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;

		setSearchParams((prev) => {
			prev.set("page", "1");
			prev.set("title", value);
			return prev;
		});
	};

	const updatePriceMin = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (parseInt(value) < 0) return;

		setSearchParams((prev) => {
			prev.set("page", "1");
			prev.set("priceMin", value);
			return prev;
		});
	};

	const updatePriceMax = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (parseInt(value) < 0) return;

		setSearchParams((prev) => {
			prev.set("page", "1");
			prev.set("priceMax", value);
			return prev;
		});
	};

	const debounceSearchChange = debounce(onSearchChange, 300);

	if (isPageLoading) {
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
		);
	}

	if (isPageError) {
		return "error";
	}

	if (productsQuery.data && categoriesQuery.data) {
		return (
			<div className={"flex flex-col gap-8 items-end"}>
				<div className="flex row justify-between w-full items-center">
					<h1 className="text-4xl font-bold tracking-wide self-start">Products</h1>
					{auth.user != null && (
						<Link to={"/products/new"} className={"btn btn-neutral"}>
							<PlusIcon />
							Add new
						</Link>
					)}
				</div>

				<div className="flex flex-col self-start w-full">
					<h3 className={"text-lg font-bold mb"}>Filters</h3>
					<div className={"flex flex-col sm:flex-row gap-4"}>
						<fieldset className={"fieldset flex-1"}>
							<legend className="fieldset-legend">Title</legend>
							<label className="input w-full">
								<SearchIcon />
								<input
									type="search"
									placeholder="Search by title"
									defaultValue={title ?? ""}
									onChange={debounceSearchChange}
								/>
							</label>
						</fieldset>

						<fieldset className={"fieldset flex-1"}>
							<legend className="fieldset-legend">Category</legend>
							<select
								className="select w-full"
								value={category}
								onChange={changeSelectedCategory}
							>
								<option disabled>Category</option>
								<option key={"all"} value={""}>
									All
								</option>
								{categoriesQuery.data.map((category) => (
									<option key={category.id} value={category.slug}>
										{category.name}
									</option>
								))}
							</select>
						</fieldset>

						<fieldset className={"fieldset flex-1"}>
							<legend className="fieldset-legend">Price range</legend>
							<div className={"flex flex-row gap-2"}>
								<label className="input">
									<input
										type="number"
										min="0"
										placeholder="Min"
										value={priceMin}
										onChange={updatePriceMin}
									/>
								</label>
								<label className="input">
									<input
										type="number"
										min="0"
										placeholder="Max"
										value={priceMax}
										onChange={updatePriceMax}
									/>
								</label>
							</div>
						</fieldset>
					</div>
					<div className="divider mb-0"></div>
				</div>

				{pageSize > 0 && page > 0 ? (
					<div className={"flex flex-col gap-2 items-end w-full"}>
						<div className="flex row gap-4 w-full justify-between items-end">
							<select
								className="select select-ghost select-sm max-w-[150px]"
								value={sortBy}
								onChange={setSortBy}
							>
								<option value={"default"} disabled>
									Sort by
								</option>
								<option value={"title"}>Title</option>
								<option value={"category"}>Category</option>
								<option value={"price-asc"}>Price (asc)</option>
								<option value={"price-desc"}>Price (desc)</option>
							</select>

							<Pagination
								page={page}
								pageSize={pageSize}
								changeSelectedPageSize={changeSelectedPageSize}
								changeSelectedPage={changeSelectedPage}
								total={productsQuery.data.total}
							/>
						</div>

						<ul className="list bg-base-100 rounded-box shadow-md w-full gap-4">
							<li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
								{(page - 1) * pageSize + 1}-
								{Math.min(page * pageSize, productsQuery.data.total)} of{" "}
								{productsQuery.data.total}
							</li>

							{productsQuery.data.total === 0 ? (
								<li className={"list-row"}>No results</li>
							) : (
								productsQuery.data.products.sort(sortProducts).map((product) => (
									<li
										key={product.id}
										className="list-row items-center flex flex-col sm:grid sm:items-start p-4 gap-2"
									>
										{product.images.length > 1 && (
											<figure className="hover-gallery size-64 sm:size-48">
												{product.images.map((image) => (
													<img
														key={image}
														className="size-64 sm:size-48 rounded-box"
														src={image}
														alt={product.title}
													/>
												))}
											</figure>
										)}

										{product.images.length === 1 && (
											// `object` provides a fallback image
											<object
												data="https://placehold.co/200x200.png"
												type="image/png"
												className="size-64 sm:size-48 rounded-box"
											>
												<img
													className="size-64 sm:size-48 rounded-box"
													src={product.images[0]}
													alt={product.title}
												/>
											</object>
										)}

										<div className={"flex flex-row gap-4 h-full"}>
											<div className="flex flex-col gap-2 justify-between content-between h-full w-full">
												<div className="flex flex-col gap-2 list-col-wrap w-full tracking-wide">
													<Link
														to={`/products/${product.id}`}
														className={"hover:underline"}
													>
														<p className="text-xl">{product.title}</p>
													</Link>
													<div className="text-xs uppercase font-semibold opacity-60">
														{product.category.name}
													</div>
													<p className="text-xs opacity-60 line-clamp-3">
														{product.description}
													</p>
												</div>
												{auth.user && (
													<div className="flex flex-row gap-2 items-center ">
														<button className={"btn btn-sm"}>
															<EditIcon />
															Edit
														</button>
														<DeleteProductButton product={product} />
													</div>
												)}
											</div>
											<div
												className={
													"flex  min-w-16 font-semibold text-xl list-col-grow justify-center"
												}
											>
												${product.price}
											</div>
										</div>
									</li>
								))
							)}
						</ul>

						<Pagination
							page={page}
							pageSize={pageSize}
							changeSelectedPageSize={changeSelectedPageSize}
							changeSelectedPage={changeSelectedPage}
							total={productsQuery.data.total}
						/>
					</div>
				) : (
					<div>Invalid parameters</div>
				)}
			</div>
		);
	}

	// Default return if no empty.
	return "empty";
}

export default ProductsPage;
