import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  rateOrder,
  getAdminDashboard,
  deleteOrder,
} from '../controllers/orderController.js';

const router = Router();

// All order routes require authentication
router.use(protect);

// Create order (Client only)
router.post('/', authorizeRoles('client'), createOrder);

// Get all orders (Admin gets all, Client gets their own)
router.get('/', getAllOrders);

// For Admin Analysis
router.get('/dashboard', protect, authorizeRoles('admin'), getAdminDashboard);
// Get single order
router.get('/:id', getOrderById);

router.delete("/:id",protect,authorizeRoles("admin"),deleteOrder);
// Update order status (Admin only)
router.put('/:id/status', authorizeRoles('admin'), updateOrderStatus);

// Rate order (Client only)
router.post('/:id/rate', authorizeRoles('client'), rateOrder);



export default router;

