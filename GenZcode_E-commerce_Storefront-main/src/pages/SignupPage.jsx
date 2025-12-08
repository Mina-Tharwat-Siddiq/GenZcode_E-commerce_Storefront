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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({ ...prev, [name]: value }));
    // };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if(formData.password.length < 8){
            setError('Password must be equal or greater than 8 characters.');
            setLoading(false);
            return;
        }

        try {
            const result = await register(formData);
            if(result.success){
                setLoading(false);
                const userRole = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).role;
                if(userRole === "admin")
                {
                    navigate('/AdminDashboard');
                }else{
                    navigate("/");
                }
            }else{
                setLoading(false);
                setError(result.error || 'Failed to signup this account alreay exist');
            }
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
                                <label htmlFor="username">name</label>
                                <input
                                    id="username"
                                    name="name"
                                    type="text"
                                    value={formData.name}
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
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="form-text">It must be at least 8 characters</div>
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


