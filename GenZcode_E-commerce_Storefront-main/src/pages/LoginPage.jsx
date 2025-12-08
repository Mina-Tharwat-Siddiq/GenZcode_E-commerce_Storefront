import { useContext, useEffect, useState } from 'react';
import AdminLogo from '../assets/Admin.svg'
import { useNavigate, Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

function AdminLogin() {
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, login } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    //UseEffect Method: If the user has logged in before, Go Direct to Home Page
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const formSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await login(formData);
            if (result.success) {
                toast.success("Logged In Successfully", {
                    icon: 'Success',
                    style: { background: '#d4edda', color: '#155724' }
                });
                setLoading(false);
                // const userRole = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).role;
                setTimeout(() => {
                    const token = localStorage.getItem('token');
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        if (payload.role === 'admin') {
                            navigate('/AdminDashboard');
                        } else {
                            navigate('/');
                        }
                    } catch {
                        navigate('/');
                    }
                }, 0);

            } else {
                toast.error("!Wrong username or password", {
                    icon: 'Failed',
                    style: { background: '#ff1111ff', color: '#FFFFFF' }
                });
                setLoading(false);
                setError(result.error || 'Wrong username or password!');
            }
        } catch (e) {
            console.error("Wrong username or password", e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <Header />
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
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="auth-field">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
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