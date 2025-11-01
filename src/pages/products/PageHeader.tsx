import { Link } from "wouter";
import { PlusIcon } from "../../components/Icons.tsx";
import { useAuth } from "../../utils/useAuth.ts";

function PageHeader() {
	const auth = useAuth();

	return (
		<div className="flex flex-col md:flex-row justify-between w-full gap-4 md:items-end">
			<div className="flex flex-col gap-2">
				<div className="breadcrumbs text-sm pb-0">
					<ul>
						<li>
							<Link to={"/"}>Home</Link>
						</li>
						<li>Products</li>
					</ul>
				</div>
				<h1 className="text-xl font-bold tracking-wide self-start">Products</h1>
			</div>
			{auth.user != null && (
				<div className={"flex"}>
					<Link to={"/products/new"} className={"btn btn-neutral btn-sm max-md:w-full"}>
						<PlusIcon />
						<span>Add new product</span>
					</Link>
				</div>
			)}
		</div>
	);
}

export default PageHeader;
