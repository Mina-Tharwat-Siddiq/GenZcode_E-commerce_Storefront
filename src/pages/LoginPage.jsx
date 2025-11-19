import { useContext, useEffect, useState } from 'react';
import AdminLogo from '../assets/Admin.svg'
import { Navigate, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';

function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, login } = useContext(AuthContext);
    //UseEffect Method: If the user has logged in before, Go Direct to Home Page
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const formSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {

            await login(username, password); 
            

            toast.success("Logged in Successfuly", {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

        } catch (e) {
            console.error("Wrong username or password", e);
        } finally {
            setLoading(false);
        }

    }
    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{ backgroundColor: '#F1AE60' }}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <div className="card p-4 rounded shadow" style={{ maxWidth: '384px', width: '100%', height: "400px" }}>
                <img src={AdminLogo}
                    alt="Admin Logo"
                    style={{
                        maxWidth: "116px",
                        height: "auto",
                        margin: "0 auto 50px auto",
                        display: "block"
                    }}
                />
                <form onSubmit={formSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-dark w-100" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin;