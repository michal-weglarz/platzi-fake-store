import {Link} from "wouter";

function Navbar() {
    return (
        <nav className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl" href={"/"}>Platzi Fake Store</a>
            </div>
            <ul className="menu menu-horizontal px-1 flex flex-row justify-between items-center gap-2">
                <li><Link to={"/products"}>Products</Link></li>
                <li><Link to={"/login"} className={'btn btn-primary'}>Login</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar;