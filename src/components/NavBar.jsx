import { useTheme } from "../context/ThemeContext";

function NavBar() {
    const { isDark, toggle } = useTheme();

    return (
        <button
            onClick={toggle}
            className="btn btn-outline-dark ms-3"
            style={{ borderRadius: "50%", width: "40px", height: "40px" }}
        >
            {isDark ? "dark" : "light"}
        </button>
    );
}

export default NavBar;