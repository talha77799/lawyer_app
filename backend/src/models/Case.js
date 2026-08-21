import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['filed', 'hearing', 'judgment', 'closed'],
      default: 'filed',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    filedDate: { type: String, required: true },
    nextHearing: { type: String },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Case', caseSchema);
