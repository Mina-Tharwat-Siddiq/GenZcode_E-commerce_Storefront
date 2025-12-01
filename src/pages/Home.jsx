import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';
import './Home.css';

function Home() {
    const { products, loading, fetchProducts } = useProducts();
    const [bestSelling, setBestSelling] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('featured');

    useEffect(() => {
        fetchProducts(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        if (products.length > 0) {
            const sorted = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            setBestSelling(sorted.slice(0, 4));
            setFeaturedProducts(sorted.slice(0, 4));
        }
    }, [products]);

    return (
        <div className="home-page">
            <Header />
            
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="hero-content">
                                <h1 className="hero-title">Fresh Arrivals Online</h1>
                                <p className="hero-subtitle">Discover Our Newest Collection Today.</p>
                                <Link to="/search" className="hero-btn">
                                    View Collection
                                    <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="hero-image-container">
                                <div className="hero-circle">
                                    <div className="star-icon">
                                        <i className="bi bi-star-fill"></i>
                                    </div>
                                    <div className="hero-model">
                                        <img 
                                            src="/e52f9cf6cc856def87647021dd851ac0c535f64b.png" 
                                            alt="Model" 
                                            className="model-image"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextElementSibling) {
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }
                                            }}
                                        />
                                        <div className="model-placeholder" style={{ display: 'none' }}>
                                            <i className="bi bi-person"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 mb-4 mb-md-0">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="bi bi-truck"></i>
                                </div>
                                <h3 className="feature-title">Free Shipping</h3>
                                <p className="feature-description">
                                    Upgrade your style today and get FREE shipping on all orders! Don't miss out.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4 mb-md-0">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="bi bi-house-check"></i>
                                </div>
                                <h3 className="feature-title">Satisfaction Guarantee</h3>
                                <p className="feature-description">
                                    Shop confidently with our Satisfaction Guarantee: Love it or get a refund.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="bi bi-shield-check"></i>
                                </div>
                                <h3 className="feature-title">Secure Payment</h3>
                                <p className="feature-description">
                                    Your security is our priority. Your payments are secure with us.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Best Selling Products Section */}
            <section className="best-selling-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">SHOP NOW</span>
                        <h2 className="section-title">Best Selling</h2>
                    </div>
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="products-grid-home">
                            {bestSelling.length > 0 ? (
                                bestSelling.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <p>No products available</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Browse Fashion Paradise Section */}
            <section className="browse-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="browse-content">
                                <h2 className="browse-title">Browse Our Fashion Paradise!</h2>
                                <p className="browse-description">
                                    Step into a world of style and explore our diverse collection of clothing categories.
                                </p>
                                <Link to="/search" className="browse-btn">
                                    Start Browsing
                                    <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="browse-image-container">
                                <img 
                                    src="/nike-tshirt.png" 
                                    alt="Nike T-Shirt" 
                                    className="browse-tshirt-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.nextElementSibling) {
                                            e.target.nextElementSibling.style.display = 'flex';
                                        }
                                    }}
                                />
                                <div className="browse-image-placeholder" style={{ display: 'none' }}>
                                    <i className="bi bi-image"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured/Latest Products Section */}
            <section className="featured-products-section">
                <div className="container">
                    <div className="products-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
                            onClick={() => setActiveTab('featured')}
                        >
                            Featured
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'latest' ? 'active' : ''}`}
                            onClick={() => setActiveTab('latest')}
                        >
                            Latest
                        </button>
                    </div>
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="featured-products-grid">
                            {featuredProducts.length > 0 ? (
                                featuredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <p>No products available</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Newsletter />
            <Footer />
        </div>
    );
}

export default Home;
