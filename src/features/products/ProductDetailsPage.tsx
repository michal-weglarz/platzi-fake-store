import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api.ts";
import PageHeader from "./PageHeader.tsx";
import PageLoading from "../../shared/PageLoading.tsx";
import PageError from "../../shared/PageError.tsx";
import { EditIcon } from "../../shared/Icons.tsx";
import { useAuth } from "../../utils/useAuth.ts";
import { getRelativeTime } from "../../utils/utils.ts";

function ProductDetailsPage() {
	const auth = useAuth();
	const params = useParams();

	const productId = params.id ? Number(params.id) : null;

	const productQuery = useQuery({
		queryKey: ["product", productId],
		queryFn: () => {
			if (productId != null) {
				return api.products.getById(productId);
			}
			return null;
		},
		gcTime: 0,
	});

	const totalImgCount = productQuery.data?.images.length ?? 0;

	const moveBack = (index: number) => {
		let prevItem = index - 1;
		if (prevItem < 0) prevItem = totalImgCount - 1;
		return prevItem;
	};

	const moveForward = (index: number) => {
		let nextItem = index + 1;
		if (nextItem > totalImgCount - 1) nextItem = 0;
		return nextItem;
	};

	if (productQuery.isPending) {
		return <PageLoading />;
	}

	if (productQuery.isError || !productQuery.data) {
		return <PageError />;
	}

	return (
		<div className={"flex flex-col gap-6"} key={productId}>
			<PageHeader
				breadcrumbs={[
					{ name: "Home", link: "/" },
					{ name: "Products", link: "/products" },
					{ name: "Details" },
				]}
				title={""}
			/>
			<div className="card lg:card-side bg-base-100 shadow-sm">
				<div className="carousel w-full lg:w-[400px] md:h-[400px]">
					{productQuery.data.images.map((image, index) => (
						<div id={index.toString()} key={image} className="carousel-item relative w-full">
							<img
								src={image}
								className="w-full object-cover p-4"
								crossOrigin="anonymous"
								alt={`${productQuery.data?.title ?? ""} product image`}
								onError={(e) => {
									e.currentTarget.src = "https://placehold.co/400x400";
								}}
							/>
							{totalImgCount > 1 && (
								<div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
									<button
										onClick={() => {
											const prevIndex = moveBack(index);
											document.getElementById(prevIndex.toString())?.scrollIntoView({
												behavior: "smooth",
												block: "nearest",
												inline: "start",
											});
										}}
										className="btn btn-circle"
									>
										❮
									</button>
									<button
										onClick={() => {
											const nextIndex = moveForward(index);
											document.getElementById(nextIndex.toString())?.scrollIntoView({
												behavior: "smooth",
												block: "nearest",
												inline: "start",
											});
										}}
										className="btn btn-circle"
									>
										❯
									</button>
								</div>
							)}
						</div>
					))}
				</div>

				<div className="card-body flex-1">
					<span className="badge badge-xs badge-warning">{productQuery.data.category.name}</span>
					<div className="flex justify-between">
						<h2 className="text-3xl font-bold">{productQuery.data.title}</h2>
						<span className="text-3xl font-bold">${productQuery.data.price}</span>
					</div>
					<p>{productQuery.data.description}</p>
					<div className="card-actions justify-end w-full items-end flex-1">
						<div className="flex flex-col flex-1">
							<div
								className={"tooltip w-fit"}
								data-tip={new Date(productQuery.data.creationAt).toLocaleString()}
							>
								<div className="text-base-content/60">
									<span className="font-medium">Created:</span>{" "}
									{getRelativeTime(productQuery.data.creationAt)}
								</div>
							</div>
							{productQuery.data.creationAt !== productQuery.data.updatedAt && (
								<div
									className={"tooltip w-fit"}
									data-tip={new Date(productQuery.data.updatedAt).toLocaleString()}
								>
									<div className="text-base-content/60">
										<span className="font-medium">Updated:</span>{" "}
										{getRelativeTime(productQuery.data.updatedAt)}
									</div>
								</div>
							)}
						</div>

						{auth.user != null && (
							<Link className="btn btn-primary" to={`/products/${productId}/edit`}>
								<EditIcon />
								Edit
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProductDetailsPage;
