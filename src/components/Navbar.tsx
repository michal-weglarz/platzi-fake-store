function Navbar() {
    return (
        <nav className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl" href={"/"}>Platzi Fake Store</a>
            </div>
            <ul className="menu menu-horizontal px-1 flex flex-row justify-between items-center gap-2">
                <li><a href={"/products"}>Products</a></li>
                <li><a href={"/login"} className={'btn btn-primary'}>Login</a></li>
            </ul>
        </nav>
    )
}

export default Navbar;