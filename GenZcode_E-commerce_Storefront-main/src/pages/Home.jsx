import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';
import './Home.css';
import Slider from '../components/Slider';
import api from '../api';

function Home() {
    const { products, loading, fetchProducts } = useProducts();
    const [bestSelling, setBestSelling] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('featured');
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        fetchProducts(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            // const sorted = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            


            const loadHomeProducts = async () => {
                try {
                    //Best Selling
                    const bestRes = await api.get('/products?best=true');
                    setBestSelling(bestRes.data.products || []);
                    // Featured
                    const featuredRes = await api.get('/products?featured=true&home=true');
                    setFeaturedProducts(featuredRes.data.products || []);
                    // Latest
                    const latestRes = await api.get('/products?home=true');
                    setLatestProducts(latestRes.data.products || []);

                } catch (e) {
                    console.error("Failed to load products");
                }
            }
            loadHomeProducts();
        }
    }, [products]);

    return (
        <div className="home-page">
            <Header />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <Slider />
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
                                    <ProductCard key={product._id} product={product} />
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
                                <h2 className="browse-title">Browse Our Products</h2>
                                <p className="browse-description">
                                    Discover a world of quality – explore our handpicked product collections.
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
                                    src="https://png.pngtree.com/png-clipart/20230504/original/pngtree-free-vector-shopping-cart-realistic-on-white-background-png-image_9139715.png"
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
            {/* <section className="featured-products-section">
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
                                    <ProductCard key={product._id} product={product} />
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <p>No products available</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section> */}
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
                            {(activeTab === 'featured' ? featuredProducts : latestProducts).length > 0 ? (
                                (activeTab === 'featured' ? featuredProducts : latestProducts).map(product => (
                                    <ProductCard key={product._id} product={product} />
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
