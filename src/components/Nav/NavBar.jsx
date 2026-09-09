import { NavLink } from "react-router-dom";
function NavBar() {
    return (
        <nav className="menu">

            <ul>

                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "button active"
                                : "button"
                        }
                    >
                        🚗 Cars
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/History"
                        className={({ isActive }) =>
                            isActive
                                ? "button active"
                                : "button"
                        }
                    >
                        📋 History
                    </NavLink>
                </li>

            </ul>

        </nav>
    )

}
export default NavBar;