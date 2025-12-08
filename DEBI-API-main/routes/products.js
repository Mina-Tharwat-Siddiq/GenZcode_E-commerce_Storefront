import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import {
  getAllProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getProductReviews,
  deleteReview
} from '../controllers/productController.js';


const router = Router();

// Get all products (Public - no auth required)
router.get('/', getAllProducts);

// Get All Categories
router.get('/categories', getCategories);

// Get single product (Public - no auth required)
router.get('/:id', getProductById);

// Create product (Admin only)
router.post('/', protect, authorizeRoles('admin'), createProduct);

// Update product (Admin only)
router.put('/:id', protect, authorizeRoles('admin'), updateProduct);

// Delete product (Admin only)
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);



// Reviews
router.post("/:id/review", protect, addReview);
router.get('/:id/reviews', protect, authorizeRoles('admin'), getProductReviews);
router.delete('/:productId/reviews/:reviewId', protect, authorizeRoles('admin'), deleteReview);

export default router;

