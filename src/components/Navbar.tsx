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
					Platzi Fake Store
				</Link>
			</div>
			<ul className="menu menu-horizontal px-4 flex flex-row justify-between items-center gap-2">
				<li>
					<Link to={"/products"}>Products</Link>
				</li>
			</ul>

			{auth.user == null ? (
				<Link to={"/login"} className={"btn"}>
					Login
				</Link>
			) : (
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
						<li>
							<a>Profile</a>
						</li>
						<li>
							<button
								onClick={() => {
									api.auth.logout(queryClient);
								}}
							>
								Log out
							</button>
						</li>
					</ul>
				</div>
			)}
		</nav>
	);
}

export default Navbar;
