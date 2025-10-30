import { BackArrowIcon } from "../../components/Icons.tsx";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../utils/api.ts";
import type { ChangeEvent } from "react";
import { toast } from "react-toastify";

function AddNewProductPage() {
	const [, navigate] = useLocation();

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
		<div className={"flex flex-col gap-8 items-end"}>
			<div className="flex row justify-between w-full items-center">
				<div className={"flex flex-row gap-2 items-center"}>
					<Link to={"/products"} className={"btn btn-ghost btn-square"}>
						<BackArrowIcon />
					</Link>

					<h1 className="text-4xl font-bold tracking-wide self-start">New product</h1>
				</div>
			</div>

			<form className={"flex flex-col w-full"} onSubmit={createNewProduct}>
				<fieldset className={"fieldset flex-1"}>
					<legend className="fieldset-legend">Title</legend>
					<input
						type="text"
						name={"title"}
						placeholder="Title"
						className={"input w-full"}
						required
					/>
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
							min="0"
							placeholder="Price"
							className={"input w-full"}
							required
							name="price"
						/>
					</fieldset>
				</div>

				<button type={"submit"} className={"btn btn-primary w-fit mt-4"}>
					Create
				</button>
			</form>
		</div>
	);
}

export default AddNewProductPage;
