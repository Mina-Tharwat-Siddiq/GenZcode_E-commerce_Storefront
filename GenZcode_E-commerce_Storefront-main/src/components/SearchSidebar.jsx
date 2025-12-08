import { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import './SearchSidebar.css';

function SearchSidebar({ filters, onFilterChange }) {
    const { products } = useProducts();
    const [selectedCategories, setSelectedCategories] = useState(filters.categories || []);
    const [selectedColor, setSelectedColor] = useState(filters.color || null);
    // const [selectedSize, setSelectedSize] = useState(filters.size || null);
    const [priceRange, setPriceRange] = useState(filters.priceRange || [0, 10000]);

    // Get unique categories from products and format them
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
    
    // Format category names for display (e.g., "mens-shirts" -> "Men's Shirts")
    const formatCategoryName = (category) => {
        if (!category) return '';
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .replace(/\bMens\b/g, "Men's")
            .replace(/\bWomens\b/g, "Women's");
    };
    
    // Fallback to default clothing categories if no products
    const defaultCategories = [
        "ُElectronics", "Croceries", "Furniture",
        "Clothing", "Books", "Home & Kitchen",
        "Sports", "Beauty", "Toys", "Other"
    ];
    const displayCategories = categories.length > 0 
        ? categories.map(formatCategoryName) 
        : defaultCategories;
    const colors = [
        { name: 'Blue', value: '#007bff' },
        { name: 'Yellow', value: '#ffc107' },
        { name: 'Green', value: '#28a745' },
        { name: 'Orange', value: '#fd7e14' },
        { name: 'Brown', value: '#8b4513' }
    ];
    // const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    const handleCategoryChange = (category) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(newCategories);
        onFilterChange({ ...filters, categories: newCategories });
    };

    const handleColorChange = (color) => {
        const newColor = selectedColor === color ? null : color;
        setSelectedColor(newColor);
        onFilterChange({ ...filters, color: newColor });
    };

    // const handleSizeChange = (size) => {
    //     const newSize = selectedSize === size ? null : size;
    //     setSelectedSize(newSize);
    //     onFilterChange({ ...filters, size: newSize });
    // };

    const handlePriceChange = (e) => {
        const newPrice = parseInt(e.target.value);
        setPriceRange([0, newPrice]);
        onFilterChange({ ...filters, priceRange: [0, newPrice] });
    };

    return (
        <div className="search-sidebar">
            {/* Categories */}
            <div className="filter-section">
                <h6 className="filter-title">Categories</h6>
                <div className="filter-options">
                    {displayCategories.map((displayCategory, index) => {
                        // Get original category name for filtering
                        const originalCategory = categories.length > 0 ? categories[index] : displayCategory.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-');
                        return (
                            <div key={displayCategory} className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    id={`category-${displayCategory}`}
                                    checked={selectedCategories.includes(originalCategory) || selectedCategories.includes(displayCategory)}
                                    onChange={() => handleCategoryChange(originalCategory)}
                                />
                                <label htmlFor={`category-${displayCategory}`}>{displayCategory}</label>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Color */}
            <div className="filter-section">
                <h6 className="filter-title">Color</h6>
                <div className="color-swatches">
                    {colors.map((color, index) => (
                        <button
                            key={index}
                            className={`color-swatch ${selectedColor === color.value ? 'selected' : ''}`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => handleColorChange(color.value)}
                            aria-label={color.name}
                        />
                    ))}
                </div>
            </div>

            {/* Size */}
            {/* <div className="filter-section">
                <h6 className="filter-title">Size</h6>
                <div className="size-buttons">
                    {sizes.map(size => (
                        <button
                            key={size}
                            className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                            onClick={() => handleSizeChange(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div> */}

            {/* Price */}
            <div className="filter-section">
                <h6 className="filter-title">Price</h6>
                <div className="price-filter">
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={handlePriceChange}
                        className="price-slider"
                    />
                    <div className="price-display">${priceRange[1].toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
}

export default SearchSidebar;

