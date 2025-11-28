import { useContext, useEffect, useState } from 'react';
import AdminLogo from '../assets/Admin.svg'
import { useNavigate, Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
        
        // التحقق من أن الحقول ليست فارغة
        if (!username.trim() || !password.trim()) {
            toast.error("يرجى إدخال اسم المستخدم وكلمة المرور", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        setLoading(true);
        try {
            await login(username, password); 
            
            // لا يتم عرض رسالة النجاح هنا لأنها موجودة في AuthContext
            // سيتم التوجيه تلقائياً بعد تسجيل الدخول الناجح

        } catch (e) {
            // رسالة الخطأ يتم عرضها من AuthContext
            console.error("Wrong username or password", e);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="auth-page">
            <Header />
            <ToastContainer />

            <section className="auth-hero">
                <div className="container">
                    <h1 className="auth-title">Login</h1>
                    <p className="auth-breadcrumb">Ecommerce &gt; Login</p>
                </div>
            </section>

            <section className="auth-content">
                <div className="container">
                    <div className="auth-card">
                        <button type="button" className="auth-google-btn" disabled>
                            <i className="bi bi-google"></i>
                            Continue with Google
                        </button>

                        <div className="auth-divider">
                            <span>OR</span>
                        </div>

                        <form onSubmit={formSubmit} className="auth-form">
                            <div className="auth-field">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="auth-field">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <p className="auth-footer-text">
                            Don't have an account?{" "}
                            <Link to="/signup">Sign up</Link>
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default AdminLogin;