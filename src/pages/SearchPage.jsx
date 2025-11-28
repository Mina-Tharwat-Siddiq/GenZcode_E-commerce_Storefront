import { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchSidebar from '../components/SearchSidebar';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { useProducts } from '../context/ProductsContext';
import './SearchPage.css';

function SearchPage() {
    const { products, loading, fetchProducts, totalProducts, limit } = useProducts();
    const [filters, setFilters] = useState({
        categories: [],
        color: null,
        size: null,
        priceRange: [0, 1000]
    });
    const [sortBy, setSortBy] = useState('default');
    const [currentPageNum, setCurrentPageNum] = useState(1);

    useEffect(() => {
        fetchProducts(currentPageNum);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPageNum]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPageNum(1);
    };

    const removeFilter = (filterType, value) => {
        const newFilters = { ...filters };
        if (filterType === 'category') {
            newFilters.categories = newFilters.categories.filter(c => c !== value);
        } else if (filterType === 'color') {
            newFilters.color = null;
        } else if (filterType === 'size') {
            newFilters.size = null;
        }
        setFilters(newFilters);
    };

    const getAppliedFilters = () => {
        const applied = [];
        filters.categories.forEach(cat => {
            // Format category name for display
            const formattedName = cat
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .replace(/\bMens\b/g, "Men's")
                .replace(/\bWomens\b/g, "Women's");
            applied.push({ type: 'category', value: cat, label: formattedName });
        });
        if (filters.color) {
            applied.push({ type: 'color', value: filters.color, label: 'Color' });
        }
        if (filters.size) {
            applied.push({ type: 'size', value: filters.size, label: `Size: ${filters.size}` });
        }
        return applied;
    };

    const filteredProducts = products.filter(product => {
        if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
            return false;
        }
        if (filters.priceRange && (product.price < filters.priceRange[0] || product.price > filters.priceRange[1])) {
            return false;
        }
        return true;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        return 0;
    });

    const totalPages = Math.ceil(totalProducts / limit);
    const startItem = (currentPageNum - 1) * limit + 1;
    const endItem = Math.min(currentPageNum * limit, totalProducts);

    const handlePageChange = (page) => {
        setCurrentPageNum(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const appliedFilters = getAppliedFilters();

    return (
        <div className="search-page">
            <Header />
            
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
                <div className="container">
                    <span>Ecommerce</span>
                    <span className="separator"> &gt; </span>
                    <span>Search</span>
                </div>
            </div>

            <div className="container search-content">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-lg-3 col-md-4">
                        <SearchSidebar filters={filters} onFilterChange={handleFilterChange} />
                    </div>

                    {/* Main Content */}
                    <div className="col-lg-9 col-md-8">
                        {/* Applied Filters */}
                        {appliedFilters.length > 0 && (
                            <div className="applied-filters">
                                <span className="applied-filters-label">Applied Filters:</span>
                                {appliedFilters.map((filter, index) => (
                                    <span key={index} className="filter-tag">
                                        {filter.label}
                                        <button
                                            onClick={() => removeFilter(filter.type, filter.value)}
                                            className="filter-remove"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Results Header */}
                        <div className="results-header">
                            <p className="results-count">
                                Showing {startItem}-{endItem} Of {totalProducts} Results.
                            </p>
                            <div className="sort-container">
                                <label className="sort-label">SORT BY</label>
                                <select
                                    className="sort-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="default">Default</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="loading">Loading...</div>
                        ) : (
                            <div className="products-grid">
                                {sortedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <nav>
                                    <ul className="pagination">
                                        <li className={`page-item ${currentPageNum === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(currentPageNum - 1)}
                                                disabled={currentPageNum === 1}
                                            >
                                                &lt;
                                            </button>
                                        </li>
                                        
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPageNum <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPageNum >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPageNum - 2 + i;
                                            }
                                            
                                            return (
                                                <li key={pageNum} className={`page-item ${currentPageNum === pageNum ? 'active' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(pageNum)}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                        
                                        {totalPages > 5 && currentPageNum < totalPages - 2 && (
                                            <>
                                                <li className="page-item disabled">
                                                    <span className="page-link">...</span>
                                                </li>
                                                <li className="page-item">
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(totalPages - 1)}
                                                    >
                                                        {totalPages - 1}
                                                    </button>
                                                </li>
                                                <li className="page-item">
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(totalPages)}
                                                    >
                                                        {totalPages}
                                                    </button>
                                                </li>
                                            </>
                                        )}
                                        
                                        <li className={`page-item ${currentPageNum === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(currentPageNum + 1)}
                                                disabled={currentPageNum === totalPages}
                                            >
                                                &gt;
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Newsletter />
            <Footer />
        </div>
    );
}

export default SearchPage;

