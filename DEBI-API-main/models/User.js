import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  phone: {
    type: String,
    trim: true,
    sparse: true, // عشان يسمح بقيم null ويحافظ على الـ unique لو حابب
    match: /^01[0125][0-9]{8}$/,
    default: null,
    required: false
  },
  
  dateOfBirth: {
    type: Date,
    default: null,
    required: false
  },
  profileImage: {
    type: String,
    default: 'https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png'  // صورة افتراضية لو مفيش صورة
  }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function(candidatePassword) {
  return compare(candidatePassword, this.password);
};

export default model('User', UserSchema);
