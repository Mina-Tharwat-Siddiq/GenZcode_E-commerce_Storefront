import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NotFound() {
    const { user } = useAuth()
    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #F1AE60 0%, #f4c28f 100%)",
            }}
        >
            <div
                className="text-center p-5 rounded-4 shadow-lg"
                style={{
                    background: "white",
                    maxWidth: "520px",
                    width: "90%",
                }}
            >
                <h1
                    className="display-1 fw-bold mb-0"
                    style={{
                        fontSize: "120px",
                        background: "linear-gradient(45deg, #F1AE60, #d97706)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    404
                </h1>

                <h2 className="mb-4 fw-bold text-dark">Opps Page Not Found!</h2>

                <div className="d-flex gap-3 justify-content-center flex-wrap">
                    {user.role==="admin"?(
                        JSON.parse(localStorage.getItem("user_auth") || "null") && (
                            <Link
                                to="/AdminDashboard"
                                className="btn btn-outline-warning btn-lg px-5"
                                style={{ borderRadius: "12px", borderWidth: "2px" }}
                            >
                                Go To Dashboard
                            </Link>
                        )
                        
                    ):(
                    <Link
                        to="/"
                        className="btn btn-dark btn-lg px-5"
                        style={{ borderRadius: "12px" }}
                    >
                        Go Home
                    </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NotFound;