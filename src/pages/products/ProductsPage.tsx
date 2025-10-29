import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type ChangeEvent } from "react";
import { Link, useSearchParams } from "wouter";
import Pagination from "./Pagination.tsx";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT_BY } from "../../utils/consts.ts";
import type { Category, Product, SortBy } from "../../utils/types.ts";
import { PlusIcon, SearchIcon } from "../../components/Icons.tsx";
import { debounce } from "../../utils/utils.ts";

function ProductsPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const pageParam = searchParams.get("page");
	const pageSizeParam = searchParams.get("pageSize");
	const priceMinParam = searchParams.get("priceMin");
	const priceMaxParam = searchParams.get("priceMax");

	const page = pageParam ? parseInt(pageParam) : DEFAULT_PAGE;
	const pageSize = pageSizeParam ? parseInt(pageSizeParam) : DEFAULT_PAGE_SIZE;
	const sortBy = (searchParams.get("sortBy") ?? DEFAULT_SORT_BY) as SortBy;
	const title = searchParams.get("title") ?? "";
	const category = searchParams.get("category") ?? "";
	const priceMin = priceMinParam ? parseInt(priceMinParam) : 0;
	const priceMax = priceMaxParam ? parseInt(priceMaxParam) : 0;

	const productsQuery = useQuery({
		queryKey: ["products", page, pageSize, title, category, priceMin, priceMax],
		queryFn: async () => {
			const offset = page * pageSize;

			const allSearchParams = new URLSearchParams();
			allSearchParams.set("title", title);
			allSearchParams.set("categorySlug", category);
			allSearchParams.set("price_min", priceMin.toString());
			allSearchParams.set("price_max", priceMax.toString());

			const paginatedSearchParams = new URLSearchParams();
			paginatedSearchParams.set("offset", offset.toString());
			paginatedSearchParams.set("limit", pageSize.toString());
			paginatedSearchParams.set("title", title);
			paginatedSearchParams.set("categorySlug", category);
			paginatedSearchParams.set("price_min", priceMin.toString());
			paginatedSearchParams.set("price_max", priceMax.toString());

			const [all, paginated] = await Promise.all([
				// This call is required for pagination. Ideally the `products` endpoint should return total number of all available products.
				fetch(`https://api.escuelajs.co/api/v1/products?${allSearchParams}`).then(
					(res) => res.json() as Promise<Product[]>
				),
				fetch(`https://api.escuelajs.co/api/v1/products?${paginatedSearchParams}`).then(
					(res) => res.json() as Promise<Product[]>
				),
			]);

			console.log("in query: ", all, paginated);

			return {
				total: all.length,
				products: paginated,
			};
		},
		// for dev
		staleTime: Infinity,
		gcTime: Infinity,
		//gcTime: 10_000, // inactive query gets removed from the cache after 10s
		placeholderData: keepPreviousData,
	});

	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: async (): Promise<Category[]> => {
			const response = await fetch(`https://api.escuelajs.co/api/v1/categories`);
			return response.json();
		},
	});

	const isPageLoading = productsQuery.isLoading || categoriesQuery.isLoading;
	const isPageError = productsQuery.isError || categoriesQuery.isError;

	const changeSelectedPage = (page: number) => {
		setSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			sortBy,
			title,
			category,
			priceMin: priceMin.toString(),
			priceMax: priceMax.toString(),
		});
	};

	const changeSelectedPageSize = (event: ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		setSearchParams({
			// It makes sense to reset the selected page when changing the size to avoid an empty page.
			page: "0",
			pageSize: value,
			sortBy,
			title,
			category,
			priceMin: priceMin.toString(),
			priceMax: priceMax.toString(),
		});
	};

	const setSortBy = (event: ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		setSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			sortBy: value,
			title,
			category,
			priceMin: priceMin.toString(),
			priceMax: priceMax.toString(),
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
		setSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			sortBy: sortBy,
			title,
			category: value,
			priceMin: priceMin.toString(),
			priceMax: priceMax.toString(),
		});
	};

	const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			sortBy: sortBy,
			title: value,
			category,
			priceMin: priceMin.toString(),
			priceMax: priceMax.toString(),
		});
	};

	const updatePriceMin = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		console.log("value", value);
		setSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			sortBy,
			title,
			category,
			priceMin: value.toString(),
			priceMax: priceMax.toString(),
		});
	};

	const updatePriceMax = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			sortBy,
			title,
			category,
			priceMin: priceMin.toString(),
			priceMax: value.toString(),
		});
	};

	const debounceSearchChange = debounce(onSearchChange, 300);
	const debounceUpdatePriceMin = debounce(updatePriceMin, 300);
	const debounceUpdatePriceMax = debounce(updatePriceMax, 300);

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
					<Link to={"/products/new"} className={"btn btn-secondary"}>
						<PlusIcon />
						Add new
					</Link>
				</div>

				<div className="flex flex-col self-start w-full">
					<h3 className={"text-lg font-bold mb"}>Filters</h3>
					<div className={"flex flex-row gap-4"}>
						<fieldset className={"fieldset"}>
							<legend className="fieldset-legend">Title</legend>
							<label className="input w-[250px]">
								<SearchIcon />
								<input
									type="search"
									placeholder="Search by title"
									defaultValue={title ?? ""}
									onChange={debounceSearchChange}
								/>
							</label>
						</fieldset>

						<fieldset className={"fieldset"}>
							<legend className="fieldset-legend">Category</legend>
							<select
								className="select w-[250px]"
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

						<fieldset className={"fieldset w-[250px]"}>
							<legend className="fieldset-legend">Price range</legend>
							<div className={"flex flex-row gap-2"}>
								<label className="input">
									<input
										type="number"
										placeholder="Min"
										value={priceMin}
										onChange={updatePriceMin}
									/>
								</label>
								<label className="input">
									<input
										type="number"
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

				{pageSize > 0 && page >= 0 ? (
					<>
						<div className="flex row gap-4 w-full justify-between items-end">
							<select className="select" value={sortBy} onChange={setSortBy}>
								<option disabled>Sort by</option>
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

						<ul className="list bg-base-100 rounded-box shadow-md w-full">
							<li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
								{page * pageSize + 1}-
								{Math.min((page + 1) * pageSize, productsQuery.data.total)} out of{" "}
								{productsQuery.data.total}
							</li>

							{productsQuery.data.total === 0 ? (
								<li className={"list-row"}>No results</li>
							) : (
								productsQuery.data.products.sort(sortProducts).map((product) => (
									<li key={product.id} className="list-row">
										{product.images.length > 1 && (
											<figure className="hover-gallery max-w-48">
												{product.images.map((image) => (
													<img
														key={image}
														className="size-48 rounded-box"
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
												className="size-48 rounded-box"
											>
												<img
													className="size-48 rounded-box"
													src={product.images[0]}
													alt={product.title}
												/>
											</object>
										)}

										<div className={"flex flex-row gap-4"}>
											<div className="flex flex-col gap-2 list-col-wrap w-full tracking-wide">
												<p className="text-xl">{product.title}</p>
												<div className="text-xs uppercase font-semibold opacity-60">
													{product.category.name}
												</div>
												<p className="text-xs opacity-60">
													{product.description}
												</p>
											</div>
											<div
												className={
													"flex w-fit min-w-16 font-semibold text-lg list-col-grow"
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
					</>
				) : (
					<div>Invalid parameters</div>
				)}
			</div>
		);
	}
	return "empty";
}

export default ProductsPage;
