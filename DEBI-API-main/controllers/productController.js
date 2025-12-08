import Product from '../models/Product.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    const isHomeRequest = req.query.home === 'true'; // ?home=true

    let finalSkip = isHomeRequest ? 0 : skip;
    let finalLimit = isHomeRequest ? 12 : limit;

    const search = req.query.q || req.query.search || '';
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { title: regex },
        { brand: regex },
        { description: regex }
      ];
    }

    const category = req.query.category;
    if (category && category.trim() !== '') {
      query.category = { $regex: new RegExp('^' + category.trim() + '$', 'i') };
    }

    let sort = req.query.sort || '-createdAt';
    if (isHomeRequest && !req.query.sort) {
      sort = '-createdAt';
    }

    if (req.query.best === 'true') {
      query.salesCount = { $gt: 0 };  
    }

    if (req.query.featured === 'true') {
      query.featured = true;
    }
    // Best Selling
    if (req.query.best === 'true') {
      sort = '-salesCount';
      finalLimit = 12;
      finalSkip = 0;
    }


    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sort)
      .skip(finalSkip)
      .limit(finalLimit);

    res.json({
      products,
      total,
      page: isHomeRequest ? 1 : page,
      pages: isHomeRequest ? 1 : Math.ceil(total / limit),
      limit
    });

  } catch (error) {
    console.error('Error in getAllProducts:', error); 
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const { title, price, stock, thumbnail, description, category, images = [], featured = false } = req.body;

    if (!title || price === undefined || stock === undefined || !category) {
      return res.status(400).json({ message: 'Name, price, stock, and category are required' });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({
        message: 'The price and stock must be greater than or equal to zero'
      });
    }

    const product = new Product({
      title,
      price,
      stock,
      thumbnail: thumbnail || '',
      description: description || '',
      category,
      images: Array.isArray(images) ? images : [],
      isAvailable: stock > 0,
      featured: Boolean(featured)
    });

    await product.save();
    res.status(201).json({
      message: "Product Added Successfully.",
      product,
      products: [product],
      total: await Product.countDocuments(),
      skip: 0,
      limit: 20
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed To Add Product!', error: error.message });
  }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { title, price, stock, images, description, thumbnail, category, featured } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (title) product.title = title;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (thumbnail !== undefined) product.thumbnail = thumbnail;
    if (images !== undefined) product.images = images;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;

    if (featured !== undefined) {
      product.featured = Boolean(featured);  // true أو false بالظبط
    }

    await product.save();
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    categories.sort((a, b) => a.localeCompare(b));

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// Reviews
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not Found." });
    }


    const alreadyReviewed = product.reviews.find(
      r => r.userId.toString() === user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have rated this product before" });
    }

    const review = {
      userId: user._id,
      reviewerName: user.name || user.username || "undefined",
      reviewerEmail: user.email,
      rating: Number(rating),
      comment: comment
    };

    product.reviews.push(review);


    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review added successfully.",
      reviews: product.reviews,
      rating: product.rating
    });

  } catch (error) {
    console.error("خطأ في addReview:", error);
    res.status(500).json({
      message: "Failed to add review!",
      error: error.message
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).select('reviews rating');

    if (!product) return res.status(404).json({ message: "Product Not Found" });

    res.json({
      reviews: product.reviews,
      totalReviews: product.reviews.length,
      averageRating: product.rating
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a review (For Admin Only)
export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product Not Found" });

    const reviewIndex = product.reviews.findIndex(r => r._id.toString() === reviewId);
    if (reviewIndex === -1) return res.status(404).json({ message: "Review Not Found" });

    product.reviews.splice(reviewIndex, 1);

    // Recalculate Evaluation
    if (product.reviews.length > 0) {
      const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = total / product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();

    res.json({ message: "Review Deleted Successfully", reviews: product.reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};