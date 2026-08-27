import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    lawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lawyerName: { type: String, required: true },
    clientName: { type: String, required: true },
    caseName: { type: String, default: '' },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm
    type: { type: String, enum: ['video', 'in-person'], default: 'video' },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    fee: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'pending' },
    paymentProvider: { type: String, default: '' },
    paymentReference: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
