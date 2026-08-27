import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['credit', 'debit', 'payout'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, default: '' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now },
});

const walletSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'PKR' },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Wallet', walletSchema);
