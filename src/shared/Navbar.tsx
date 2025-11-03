import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import api from "../utils/api.ts";
import { useAuth } from "../utils/useAuth.ts";

function Navbar() {
	const queryClient = useQueryClient();
	const auth = useAuth();

	return (
		<nav className="navbar bg-base-100 shadow-sm fixed z-2 top-0">
			<div className="flex-1">
				<Link to={"/products"} className="btn btn-ghost text-xl">
					Platzi
					<span className={"md:block hidden"}>Fake Store</span>
				</Link>
			</div>
			{/*<ul className="menu menu-horizontal px-4 flex flex-row justify-between items-center gap-2">*/}
			{/*	<li>*/}
			{/*		<Link to={"/products"}>Products</Link>*/}
			{/*	</li>*/}
			{/*</ul>*/}

			{auth.user == null ? (
				<Link to={"/login"} className={"btn"}>
					Login
				</Link>
			) : (
				<div className={"flex flex-row gap-2 items-center"}>
					<p>{auth.user.name}</p>
					<div className="dropdown dropdown-end">
						<div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
							<div className="w-10 rounded-full">
								<img alt="Tailwind CSS Navbar component" src={auth.user.avatar} />
							</div>
						</div>
						<ul
							tabIndex={-1}
							className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
						>
							<div className="p-2 flex flex-col gap-2">
								<p className={"uppercase text-xs badge-xs badge-soft badge-secondary badge"}>
									{auth.user.role} #{auth.user.id}
								</p>
								<p className={"font-bold"}>{auth.user.name}</p>
								<p className={"text-xs text-slate-600"}>{auth.user.email}</p>
							</div>
							<li>
								<button
									className={"btn btn-neutral btn-block btn-sm"}
									onClick={() => {
										api.auth.logout();
										queryClient.resetQueries({ queryKey: ["profile"] });
									}}
								>
									Log out
								</button>
							</li>
						</ul>
					</div>
				</div>
			)}
		</nav>
	);
}

export default Navbar;
