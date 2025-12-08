import { Schema, model } from 'mongoose';

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  review: { 
    type: String, 
    default: '' 
  },
  ratedAt: { 
    type: Date 
  },
}, { timestamps: true });

export default model('Order', OrderSchema);

