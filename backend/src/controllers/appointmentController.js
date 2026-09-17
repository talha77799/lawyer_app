import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

export const createAppointment = async (req, res) => {
  try {
    const { lawyerId, date, time, type, caseName, notes, paymentProvider, paymentReference, paymentConfirmed } = req.body;
    if (!lawyerId || !date || !time) {
      return res.status(400).json({ success: false, message: 'lawyerId, date and time are required' });
    }

    const lawyer = await User.findOne({ _id: lawyerId, role: 'lawyer' });
    if (!lawyer) {
      return res.status(404).json({ success: false, message: 'Lawyer not found' });
    }
    if (!lawyer.bankAccountNumber) {
      return res.status(400).json({ success: false, message: 'This lawyer has not added a bank account yet. Booking is unavailable.' });
    }
    if (paymentConfirmed !== true || !paymentProvider?.trim() || !paymentReference?.trim()) {
      return res.status(402).json({ success: false, message: 'Payment to the lawyer bank account is required before booking.' });
    }
    if (paymentProvider.trim() !== lawyer.bankProvider) {
      return res.status(400).json({ success: false, message: `Please select ${lawyer.bankProvider} for this lawyer's payment account.` });
    }

    const appointment = await Appointment.create({
      lawyer: lawyer._id,
      client: req.user._id,
      lawyerName: lawyer.name,
      clientName: req.user.name,
      caseName: caseName || '',
      date,
      time,
      type: type || 'video',
      fee: lawyer.fee,
      paymentStatus: 'paid',
      paymentProvider: paymentProvider.trim(),
      paymentReference: paymentReference.trim(),
      notes: notes || '',
      status: 'upcoming',
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const filter =
      req.user.role === 'lawyer'
        ? { lawyer: req.user._id }
        : { client: req.user._id };

    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter)
      .populate('lawyer', 'name avatar city specialization fee')
      .populate('client', 'name email phone city')
      .sort({ date: 1, time: 1 });

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['upcoming', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Only client or assigned lawyer can update
    const isOwner =
      appointment.client.toString() === req.user._id.toString() ||
      appointment.lawyer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    appointment.status = status;
    await appointment.save();
    res.json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCalendar = async (req, res) => {
  try {
    const filter =
      req.user.role === 'lawyer'
        ? { lawyer: req.user._id }
        : { client: req.user._id };

    const appointments = await Appointment.find(filter).sort({ date: 1 });
    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
