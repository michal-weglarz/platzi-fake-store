import { useLocation, useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/api.ts";
import { type ChangeEvent } from "react";
import { toast } from "react-toastify";
import PageHeader from "./PageHeader.tsx";
import PageError from "../../shared/PageError.tsx";
import type { UpdateProductData } from "../../utils/types.ts";
import ProductFormLoadingSkeleton from "./ProductFormLoadingSkeleton.tsx";

function ProductFormPage() {
	const [, navigate] = useLocation();
	const queryClient = useQueryClient();
	const params = useParams();

	const productId = params.id ? Number(params.id) : null;
	const isInEditMode = productId != null;

	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: () => api.categories.getAll(),
	});

	const productQuery = useQuery({
		enabled: isInEditMode,
		queryKey: ["product", productId],
		queryFn: () => {
			if (productId != null) {
				return api.products.getById(productId);
			}
			return null;
		},
	});

	const createMutation = useMutation({
		mutationFn: api.products.create,
		onSuccess: (data) => {
			toast.success(`A new product ${data.title} has been added!`);
			queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
			navigate("/products");
		},
		onError: () => {
			toast.error(`An error occurred while creating products!`);
		},
	});

	const editMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateProductData }) => api.products.update(id, data),
		onSuccess: (data) => {
			toast.success(`The product ${data.title} has been updated!`);
			queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
			navigate("/products");
		},
		onError: () => {
			toast.error(`An error occurred while updating product!`);
		},
	});

	const handleFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const title = formData.get("title");
		const description = formData.get("description");
		const price = formData.get("price");
		const categoryId = formData.get("categoryId");

		if (isInEditMode) {
			const params = {
				id: productId,
				data: {} as UpdateProductData,
			};

			if (title) params.data["title"] = title as string;
			if (description) params.data["description"] = description as string;
			if (price) params.data["price"] = parseInt(price as string);
			if (categoryId) params.data["categoryId"] = parseInt(categoryId as string);

			editMutation.mutate(params);
			return;
		}

		if (title && description && price && categoryId) {
			createMutation.mutate({
				title: title as string,
				description: description as string,
				categoryId: parseInt(categoryId as string),
				price: parseInt(price as string),
				images: ["https://placehold.co/600x400"],
			});
		} else {
			toast.error("Missing required fields!");
		}
	};

	if ((isInEditMode && productQuery.isPending) || categoriesQuery.isPending) {
		return <ProductFormLoadingSkeleton isInEditMode={isInEditMode} />;
	}

	if (isInEditMode && (productQuery.isError || productQuery.isError)) {
		return <PageError />;
	}

	return (
		<div className={"flex flex-col gap-6"}>
			<PageHeader
				breadcrumbs={[
					{ name: "Home", link: "/" },
					{ name: "Products", link: "/products" },
					{ name: isInEditMode ? "Edit product" : "Add product" },
				]}
				title={isInEditMode ? "Edit product" : "Add product"}
			/>

			<div className={"card bg-base-100 w-full shadow-sm p-4"}>
				<form className={"flex flex-col w-full"} onSubmit={handleFormSubmit}>
					<fieldset className={"fieldset flex-1"}>
						<legend className="fieldset-legend">Title</legend>
						<input
							type="text"
							name={"title"}
							placeholder="Title"
							className={"input w-full"}
							defaultValue={productQuery.data?.title}
							required
						/>
					</fieldset>

					<fieldset className={"fieldset flex-1 "}>
						<legend className="fieldset-legend">Description</legend>
						<textarea
							className="textarea w-full"
							placeholder="Description"
							defaultValue={productQuery.data?.description}
							required
							name="description"
						></textarea>
					</fieldset>

					<div className="flex flex-row gap-2">
						<fieldset className={"fieldset flex-1"}>
							<legend className="fieldset-legend">Category</legend>
							<select
								className="select w-full"
								required
								defaultValue={productQuery.data?.category.id}
								name={"categoryId"}
							>
								{categoriesQuery.data ? (
									<>
										<option disabled>Category</option>
										{categoriesQuery.data?.map((category) => (
											<option key={category.id} value={category.id}>
												{category.name}
											</option>
										))}
									</>
								) : (
									<option disabled>No available category</option>
								)}
							</select>
						</fieldset>

						<fieldset className={"fieldset flex-1"}>
							<legend className="fieldset-legend">Price</legend>
							<input
								type="number"
								min="1"
								placeholder="Price"
								className={"input w-full"}
								defaultValue={productQuery.data?.price}
								required
								name="price"
							/>
						</fieldset>
					</div>

					<button
						type={"submit"}
						className={"btn btn-neutral w-fit mt-4"}
						disabled={createMutation.isPending || editMutation.isPending}
					>
						{createMutation.isPending || editMutation.isPending ? (
							<>
								<span className="loading loading-spinner"></span>
								Saving...
							</>
						) : (
							"Save"
						)}
					</button>
				</form>
			</div>
		</div>
	);
}

export default ProductFormPage;
