import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Boolean, default: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['client', 'lawyer', 'admin'], default: 'client' },
    city: { type: String, default: '' },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    // Lawyer-specific (when role === 'lawyer')
    specialization: [{ type: String }],
    experience: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    bio: { type: String, default: '' },
    languages: [{ type: String }],
    education: { type: String, default: '', trim: true },
    qualificationDocument: {
      type: String,
      default: '',
      required: function () {
        return this.role === 'lawyer';
      },
    },
    barCouncil: { type: String, default: '' },
    location: { type: String, default: '' },
    availability: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
