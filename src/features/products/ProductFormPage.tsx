import { useLocation, useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/api.ts";
import { type ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageHeader from "./PageHeader.tsx";
import PageError from "../../shared/PageError.tsx";
import type { Category, CreateProductData, FileUploadResponse, UpdateProductData } from "../../utils/types.ts";
import ProductFormLoadingSkeleton from "./ProductFormLoadingSkeleton.tsx";
import FileUpload from "./FileUpload.tsx";

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
		// Need to ensure that when I re-enter the page I see the form with re-fetched up-to-date values.
		gcTime: 0,
	});

	const [uploadedImages, setUploadedImages] = useState<FileUploadResponse[]>([]);
	// I need to store in the local state both the already added images and the images I'm about to upload.
	// That's why I'm using this useEffect here.
	useEffect(() => {
		if (productQuery.isSuccess && productQuery.data && productQuery.data.images) {
			const productQueryImages = productQuery.data.images.map((img) => ({
				filename: img,
				location: img,
				originalname: img,
			}));
			setUploadedImages(productQueryImages);
		}
	}, [productQuery.isSuccess, productQuery.data]);

	const [isAddingImages, setIsAddingImages] = useState(false);

	const createMutation = useMutation({
		mutationFn: api.products.create,
		onSuccess: (data) => {
			toast.success(`A new product ${data.title} has been added!`);
			queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
			navigate("/products");
		},
		onError: () => {
			toast.error(`An error occurred while creating products`);
		},
	});

	const editMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateProductData }) => api.products.update(id, data),
		onSuccess: (data) => {
			toast.success(`The product ${data.title} has been updated!`);
			queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
		},
		onError: () => {
			toast.error(`An error occurred while updating product`);
		},
	});

	const handleFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const title = formData.get("title");
		const description = formData.get("description");
		const price = formData.get("price");
		const categoryId = formData.get("categoryId");

		let category: Category | null = null;
		if (categoriesQuery.data) {
			category = categoriesQuery.data.find((item) => item.id.toString() === categoryId) ?? null;
		}

		if (isInEditMode) {
			const params = {
				id: productId,
				data: {
					title: title as string,
					description: description as string,
					price: parseInt(price as string),
					// FIXME: Neither Category nor CategoryId works when trying to update a product. Why?
					categoryId: parseInt(categoryId as string),
					category: category,
				} as UpdateProductData,
			};

			if (uploadedImages.length > 0) params.data["images"] = uploadedImages.map((image) => image.location);
			editMutation.mutate(params);
		} else {
			if (title && description && price && category && uploadedImages.length > 0) {
				const params = {
					title: title as string,
					description: description as string,
					categoryId: parseInt(categoryId as string),
					price: parseInt(price as string),
					images: uploadedImages.map((image) => image.location),
				} as CreateProductData;

				createMutation.mutate(params);
			} else {
				const missingFields = [];
				if (uploadedImages.length === 0) {
					missingFields.push("images");
				}
				if (!title) {
					missingFields.push("title");
				}
				if (!price) {
					missingFields.push("price");
				}
				if (!category) {
					missingFields.push("category");
				}

				toast.error(`Missing required fields: ${missingFields.join(", ")}`);
			}
		}
	};

	if ((isInEditMode && productQuery.isPending) || categoriesQuery.isPending) {
		return <ProductFormLoadingSkeleton isInEditMode={isInEditMode} />;
	}

	if (isInEditMode && (productQuery.isError || productQuery.isError)) {
		return <PageError />;
	}

	return (
		<div className={"flex flex-col gap-4"}>
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
							className={"input w-full validator"}
							defaultValue={productQuery.data?.title}
							required
						/>
						<div className="validator-hint hidden">Title can't be empty</div>
					</fieldset>

					<fieldset className={"fieldset flex-1 "}>
						<legend className="fieldset-legend">Description</legend>
						<textarea
							className="textarea w-full validator"
							placeholder="Description"
							rows={4}
							defaultValue={productQuery.data?.description}
							required
							name="description"
						></textarea>
						<div className="validator-hint hidden">Description can't be empty</div>
					</fieldset>

					<div className="flex flex-row gap-2">
						<fieldset className={"fieldset flex-1"}>
							<legend className="fieldset-legend">Category</legend>
							<select
								className="select w-full validator"
								required
								defaultValue={productQuery.data?.category.id ?? ""}
								name={"categoryId"}
							>
								{categoriesQuery.data ? (
									<>
										<option disabled value="">
											Choose category
										</option>
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
							<p className="validator-hint hidden">Select a category</p>
						</fieldset>

						<fieldset className={"fieldset flex-1"}>
							<legend className="fieldset-legend">Price</legend>
							<input
								type="number"
								min="1"
								placeholder="Price"
								className={"input w-full validator"}
								defaultValue={productQuery.data?.price}
								required
								name="price"
							/>
							<p className="validator-hint hidden">Must be minium 1</p>
						</fieldset>
					</div>

					<FileUpload
						isInEditMode={isInEditMode}
						uploadedImages={uploadedImages}
						setUploadedImages={setUploadedImages}
						setIsAddingImages={setIsAddingImages}
					/>

					<button
						type={"submit"}
						className={"btn btn-neutral w-fit mt-8"}
						disabled={createMutation.isPending || editMutation.isPending || isAddingImages}
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
