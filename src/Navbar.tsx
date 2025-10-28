function Navbar() {
    return (
        <nav className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl" href={"/"}>Platzi Fake Store</a>
            </div>
            <div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li><a href={"/products"}>Products</a></li>
                        <li>
                            <details>
                                <summary>Parent</summary>
                                <ul className="bg-base-100 rounded-t-none p-2">
                                    <li><a>Link 1</a></li>
                                    <li><a>Link 2</a></li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;