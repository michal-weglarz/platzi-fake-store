import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/api.ts";
import type { ChangeEvent } from "react";
import { toast } from "react-toastify";
import PageHeader from "./PageHeader.tsx";

function AddNewProductPage() {
	const [, navigate] = useLocation();
	const queryClient = useQueryClient();

	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			return api.categories.getAll();
		},
	});

	const mutation = useMutation({
		mutationFn: api.products.create,
		onSuccess: (data) => {
			toast.success(`A new product "${data.title}" has been added!`);
			queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
			navigate("/products");
		},
		onError: () => {
			toast.error(`An error occurred while creating products!`);
		},
	});

	const createNewProduct = (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const title = formData.get("title");
		const description = formData.get("description");
		const price = formData.get("price");
		const categoryId = formData.get("categoryId");

		if (title && description && price && categoryId) {
			mutation.mutate({
				title: title as string,
				description: description as string,
				categoryId: parseInt(categoryId as string),
				price: parseInt(price as string),
				images: ["https://placehold.co/600x400"],
			});
		}
	};

	return (
		<div className={"flex flex-col gap-6 items-end"}>
			<PageHeader
				breadcrumbs={[
					{ name: "Home", link: "/" },
					{ name: "Products", link: "/products" },
					{ name: "Add product" },
				]}
				title={"Add product"}
			/>

			<div className={"card bg-base-100 w-full shadow-sm p-4"}>
				<form className={"flex flex-col w-full"} onSubmit={createNewProduct}>
					<fieldset className={"fieldset flex-1"}>
						<legend className="fieldset-legend">Title</legend>
						<input type="text" name={"title"} placeholder="Title" className={"input w-full"} required />
					</fieldset>

					<fieldset className={"fieldset flex-1 "}>
						<legend className="fieldset-legend">Description</legend>
						<textarea
							className="textarea w-full"
							placeholder="Description"
							required
							name="description"
						></textarea>
					</fieldset>

					<div className="flex flex-row gap-2">
						<fieldset className={"fieldset flex-1"}>
							<legend className="fieldset-legend">Category</legend>
							<select className="select w-full" required name={"categoryId"}>
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
								required
								name="price"
							/>
						</fieldset>
					</div>

					<button type={"submit"} className={"btn btn-neutral w-fit mt-4"} disabled={mutation.isPending}>
						{mutation.isPending ? (
							<>
								<span className="loading loading-spinner"></span>
								Adding...
							</>
						) : (
							"Add"
						)}
					</button>
				</form>
			</div>
		</div>
	);
}

export default AddNewProductPage;
