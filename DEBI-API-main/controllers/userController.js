import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const searchQuery = search
      ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
      : {};
    const total = await User.countDocuments(searchQuery);
    const users = await User.find(searchQuery)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, phone, dateOfBirth, profileImage } = req.body;
    const user = await User.findById(req.params.id || req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is updating themselves or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    // Only admin can change roles
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can change user roles' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone || null;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth || null;
    if (email) user.email = email;
    if (role && req.user.role === 'admin') {
      if (role === 'admin' || role === 'client') {
        user.role = role;
      } else {
        return res.status(400).json({ message: 'Invalid role. Must be admin or client' });
      }
    }
    // Save Image In Cloudinary
    if (profileImage) {
      user.profileImage = profileImage; // رابط Cloudinary كامل
    }

    await user.save();

    // Generate new token if role changed
    let token = null;
    if (role && req.user.id === req.params.id) {
      const jwt = (await import('jsonwebtoken')).default;
      const payload = { id: user._id, role: user.role, email: user.email };
      token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    }

    res.json({
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        profileImage: user.profileImage || null,
        role: user.role },
      token: token || undefined
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only admin can delete users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete users' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

