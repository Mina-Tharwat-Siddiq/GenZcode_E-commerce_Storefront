import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  thumbnail: { type: String, default: '' },
  description: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    trim: true,
    default: 'Uncategorized'
  },
  images: [{
    type: String
  }],
  
  isAvailable: {
    type: Boolean,
    default: true
  },
  reviews: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewerName: String,
    reviewerEmail: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  rating: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  salesCount: { type: Number, default: 0 }

}, { timestamps: true });

export default model('Product', ProductSchema);

