import { DeleteIcon } from "../../components/Icons.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/api.ts";
import { toast } from "react-toastify";
import type { Product } from "../../utils/types.ts";
import { useSearchParams } from "wouter";

interface Props {
	product: Product;
}

function DeleteProductButton(props: Props) {
	const queryClient = useQueryClient();
	const [, setSearchParams] = useSearchParams();

	const mutation = useMutation({
		mutationFn: api.products.delete,
		onSuccess: () => {
			toast.success(`Product ${props.product.title} has been deleted!`);
			queryClient.refetchQueries({ queryKey: ["products"], exact: false });
			setSearchParams((prev) => {
				prev.set("page", "0");
				return prev;
			});
		},
		onError: () => {
			toast.error(`An error occurred while deleting the product!`);
		},
	});

	const dialogId = `remove-product-dialog-${props.product.id}`;

	const deleteProduct = () => {
		mutation.mutate(props.product.id);
	};

	return (
		<>
			<button
				className={"btn btn-sm"}
				onClick={() => {
					const dialog = document.getElementById(dialogId) as HTMLDialogElement;
					if (dialog) {
						dialog.showModal();
					}
				}}
			>
				<DeleteIcon />
				Delete
			</button>
			<dialog id={dialogId} className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Are you sure?</h3>
					<p className="py-4">
						You're going to delete <b>{props.product.title}</b>. This action is
						irreversible. Once you delete the product, you can't restore it.
					</p>
					<div className="modal-action">
						<form method="dialog" className={"flex flex-row gap-2"}>
							<button className="btn">Cancel</button>
							<button className="btn btn-error" onClick={deleteProduct}>
								Delete
							</button>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
}

export default DeleteProductButton;
