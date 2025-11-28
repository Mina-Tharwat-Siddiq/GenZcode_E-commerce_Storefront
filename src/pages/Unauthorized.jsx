// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom";

function Unauthorized() {
    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #F1AE60 0%, #e89b4e 100%)",
            }}
        >
            <div
                className="text-center p-5 rounded-4 shadow-lg"
                style={{
                    background: "white",
                    maxWidth: "480px",
                    width: "90%",
                }}
            >
                {/* الأيقونة الكبيرة */}
                <div className="mb-4">
                    <i
                        className="bi bi-shield-lock-fill"
                        style={{ fontSize: "80px", color: "#F1AE60" }}
                    ></i>
                </div>

                <h1 className="display-5 fw-bold mb-3" style={{ color: "#333" }}>
                    403 Forbidden
                </h1>

                <p className="lead text-muted mb-4">
                    Unauthorized Page
                </p>

                <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Link
                        to="/"
                        className="btn btn-dark btn-lg px-4"
                        style={{ borderRadius: "12px" }}
                    >
                    Go Home
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Unauthorized;