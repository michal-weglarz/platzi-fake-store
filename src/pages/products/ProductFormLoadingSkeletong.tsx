import PageHeader from "./PageHeader.tsx";

function ProductFormLoadingSkeleton() {
	return (
		<div className={"flex flex-col gap-6"}>
			<PageHeader
				breadcrumbs={[
					{ name: "Home", link: "/" },
					{ name: "Products", link: "/products" },
					{ name: "Edit product" },
				]}
				title={"Edit product"}
			/>

			<div className={"card bg-base-100 w-full shadow-sm p-4"}>
				<form className={"flex flex-col w-full gap-4"}>
					<fieldset className={"fieldset flex-1"}>
						<div className="skeleton h-6 w-36"></div>
						<div className="skeleton h-10 w-full"></div>
					</fieldset>

					<fieldset className={"fieldset flex-1 "}>
						<div className="skeleton h-6 w-36"></div>
						<div className="skeleton h-20 w-full"></div>
					</fieldset>

					<div className="flex flex-row gap-2">
						<fieldset className={"fieldset flex-1"}>
							<div className="skeleton h-6 w-36"></div>
							<div className="skeleton h-10 w-full"></div>
						</fieldset>

						<fieldset className={"fieldset flex-1"}>
							<div className="skeleton h-6 w-36"></div>
							<div className="skeleton h-10 w-full"></div>
						</fieldset>
					</div>

					<div className="skeleton h-8 w-36"></div>
				</form>
			</div>
		</div>
	);
}

export default ProductFormLoadingSkeleton;
