import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  start: { type: String, required: true }, // "09:00"
  end: { type: String, required: true },   // "10:00"
  booked: { type: Boolean, default: false },
});

const daySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true,
  },
  locationType: {
    type: String,
    enum: ['online', 'chamber', 'home', 'office'],
    default: 'online',
  },
  locationLabel: { type: String, default: '' },
  slots: [slotSchema],
  isActive: { type: Boolean, default: true },
});

const availabilitySchema = new mongoose.Schema(
  {
    lawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    feeVideo: { type: Number, default: 0 },
    feeInPerson: { type: Number, default: 0 },
    cities: [{ type: String }],
    schedule: [daySchema],
  },
  { timestamps: true }
);

export default mongoose.model('Availability', availabilitySchema);
