import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create order (Client only)
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate items and calculate total
    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({ message: 'Each item must have productId and quantity' });
      }

      if (item.quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title}. Available: ${product.stock}`
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Update product stock
      product.stock -= item.quantity;
      // Increase product selling count
      product.salesCount = (product.salesCount || 0) + item.quantity;

      await product.save();
    }

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      status: 'pending',
    });

    await order.save();
    await order.populate('items.product', 'title image');

    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders (Admin gets all, Client gets their own)
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let query = {};
    // Customer see his orders . Admin See All
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }
    // FIlter depend on status pending or dlivered etc...
    if (req.query.status) {
      query.status = req.query.status;
    }
    //  For Admin Only By Client name or email
    if (req.query.search && req.user.role === 'admin') {
      const search = req.query.search.trim();
      query.$or = [
        { _id: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }

    const sort = req.query.sort || '-createdAt';
    // Total number of pagination
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query).
      populate('user', 'name email profileImage')
      .populate({
        path: 'items.product',
        select: 'title price image images thumbnail'
      })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);
    // if (req.user.role === 'admin') {
    //   orders = await Order.find().populate('user', 'name email').populate('items.product', 'name image');
    // } else {
    //   orders = await Order.find({ user: req.user.id }).populate('items.product', 'name image');
    // }

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email profileImage')
      .populate('items.product', 'title image price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Client can only see their own orders
    if (req.user.role === 'client' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If cancelling order, restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.status = status;
    await order.save();

    await order.populate('user', 'name email');
    await order.populate('items.product', 'title image');

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Rate order (Client only, after delivery)
export const rateOrder = async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to rate this order' });
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only rate delivered orders' });
    }

    // Check if already rated
    if (order.rating) {
      return res.status(400).json({ message: 'Order already rated' });
    }

    order.rating = rating;
    order.review = review || '';
    order.ratedAt = new Date();

    await order.save();
    await order.populate('items.product', 'title image');

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Dashboard Analytics - NEW ENDPOINT
export const getAdminDashboard = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // 1. Total Sales This Month
    const salesResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: {
            $nin: ['cancelled'] }
        }
        },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalSalesThisMonth = salesResult.length > 0 ? salesResult[0].total : 0;

    // 2. Total Orders This Month
    const totalOrdersThisMonth = await Order.countDocuments({
      createdAt: { $gte: startOfMonth },
      status: { $nin: ['cancelled'] }
    });

    // 3. New Customers This Month (users who made their first order this month)
    const newCustomers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: "$user",
          firstOrder: { $min: "$createdAt" }
        }
      },
      {
        $match: {
          firstOrder: { $gte: startOfMonth }
        }
      },
      {
        $count: "newCustomers"
      }
    ]);

    const totalCustomersThisMonth = newCustomers.length > 0 ? newCustomers[0].newCustomers : 0;

    // أو لو عايز كل اليوزرز اللي اشتروا الشهر ده (مش أول طلبية بس):
    // const customersThisMonth = await Order.distinct("user", { createdAt: { $gte: startOfMonth } });
    // const totalCustomersThisMonth = customersThisMonth.length;

    // 4. Recent 5 Orders
    const recentOrders = await Order.find({
      status: { $nin: ['cancelled'] }
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .select('totalAmount status createdAt')
      .lean();

    const formattedRecent = recentOrders.map(o => ({
      id: o._id,
      customerName: o.user?.name || 'غير معروف',
      date: o.createdAt.toISOString().split('T')[0],
      total: o.totalAmount,
      status: o.status
    }));

    // 5. Best Selling Products This Month (by revenue)
    const bestSelling = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth }, status: { $nin: ['cancelled'] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          totalQty: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: "$product.title",
          sales: "$totalSales"
        }
      }
    ]);

    // Monthly Goal (تقدر تغيّره زي ما تحب)
    const monthlyGoal = 1000;
    const ordersLeftToGoal = monthlyGoal - totalOrdersThisMonth > 0 ? monthlyGoal - totalOrdersThisMonth : 0;

    res.json({
      totalSalesThisMonth: Number(totalSalesThisMonth.toFixed(2)),
      totalOrdersThisMonth,
      totalCustomersThisMonth,
      monthlyGoal,
      ordersLeftToGoal,
      recentOrders: formattedRecent,
      bestSelling: bestSelling.length > 0 ? bestSelling : []
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};

// Delete Order For Admin Only
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await Order.deleteOne({ _id: req.params.id }); 
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};