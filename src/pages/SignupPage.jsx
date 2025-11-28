import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthContext from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import './SignupPage.css';

function SignupPage() {
    const navigate = useNavigate();
    const { user, register } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            navigate('/');
        } catch {
            // الرسائل تظهر من داخل AuthContext
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Header />
            <ToastContainer />

            <section className="auth-hero">
                <div className="container">
                    <h1 className="auth-title">Sign up</h1>
                    <p className="auth-breadcrumb">Ecommerce &gt; Sign up</p>
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

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="auth-field">
                                <label htmlFor="firstName">First name</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="lastName">Last name</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? 'Creating account...' : 'Create account'}
                            </button>
                        </form>

                        <p className="auth-footer-text">
                            Already have an account?{' '}
                            <Link to="/login">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default SignupPage;


