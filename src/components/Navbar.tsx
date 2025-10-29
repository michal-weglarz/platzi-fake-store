import { Link } from "wouter";

function Navbar() {
	return (
		<nav className="navbar bg-base-100 shadow-sm fixed z-2 top-0">
			<div className="flex-1">
				<Link to={"/products"} className="btn btn-ghost text-xl">
					Platzi Fake Store
				</Link>
			</div>
			<ul className="menu menu-horizontal px-1 flex flex-row justify-between items-center gap-2">
				<li>
					<Link to={"/404-page"}>404 page</Link>
				</li>
				<li>
					<Link to={"/products"}>Products</Link>
				</li>
				<li>
					<Link to={"/login"} className={"btn"}>
						Login
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;
