import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api.ts";
import PageHeader from "./PageHeader.tsx";
import PageLoading from "../../shared/PageLoading.tsx";
import PageError from "../../shared/PageError.tsx";
import { EditIcon } from "../../shared/Icons.tsx";
import { useAuth } from "../../utils/useAuth.ts";

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
	});

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
				<div className="carousel w-full">
					{productQuery.data.images.map((image, index) => (
						<div id={index.toString()} key={image} className="carousel-item relative w-full">
							<img
								src={image}
								className="w-full"
								alt={`${productQuery.data?.title ?? ""} product image`}
								onError={(e) => {
									e.currentTarget.src = "https://placehold.co/400x400";
								}}
							/>
							<div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
								<a href={`#${Math.max(index - 1, 0)}`} className="btn btn-circle">
									❮
								</a>
								<a
									href={`#${Math.min(index + 1, (productQuery.data?.images.length ?? 1) - 1)}`}
									className="btn btn-circle"
								>
									❯
								</a>
							</div>
						</div>
					))}
				</div>

				<div className="card-body lg:min-w-[800px]">
					<span className="badge badge-xs badge-warning">{productQuery.data.category.name}</span>
					<div className="flex justify-between">
						<h2 className="text-3xl font-bold">{productQuery.data.title}</h2>
						<span className="text-xl">${productQuery.data.price}</span>
					</div>
					<p>{productQuery.data.description}</p>
					<div className="card-actions justify-end">
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
