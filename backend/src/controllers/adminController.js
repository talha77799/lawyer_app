import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Case from '../models/Case.js';
import Review from '../models/Review.js';
import Wallet from '../models/Wallet.js';
import Availability from '../models/Availability.js';

const resources = { users: User, appointments: Appointment, cases: Case, reviews: Review, wallets: Wallet, availability: Availability };
const userFields = ['name', 'phone', 'city', 'role', 'isActive', 'verified', 'online', 'bio', 'specialization', 'experience', 'fee', 'languages', 'education', 'barCouncil', 'location', 'availability'];
const resourceFields = {
  appointments: ['date', 'time', 'type', 'status', 'fee', 'notes'],
  cases: ['title', 'status', 'progress', 'filedDate', 'nextHearing', 'description'],
  reviews: ['rating', 'comment'], wallets: ['balance', 'currency'], availability: ['feeVideo', 'feeInPerson', 'cities', 'schedule'],
};

const pick = (body, fields) => fields.reduce((result, field) => {
  if (body[field] !== undefined) result[field] = body[field];
  return result;
}, {});

export const getOverview = async (req, res) => {
  const [users, lawyers, clients, appointments, cases, reviews, wallets] = await Promise.all([
    User.countDocuments(), User.countDocuments({ role: 'lawyer' }), User.countDocuments({ role: 'client' }),
    Appointment.countDocuments(), Case.countDocuments(), Review.countDocuments(), Wallet.countDocuments(),
  ]);
  res.json({ success: true, stats: { users, lawyers, clients, appointments, cases, reviews, wallets } });
};

export const listResource = async (req, res) => {
  const Model = resources[req.params.resource];
  if (!Model) return res.status(404).json({ success: false, message: 'Unknown admin resource' });
  const query = req.params.resource === 'users' && req.query.role ? { role: req.query.role } : {};
  const records = await Model.find(query).sort({ createdAt: -1 }).limit(200).lean();
  res.json({ success: true, records });
};

export const updateResource = async (req, res) => {
  const { resource, id } = req.params;
  const Model = resources[resource];
  if (!Model) return res.status(404).json({ success: false, message: 'Unknown admin resource' });
  if (resource === 'users' && id === String(req.user._id) && (req.body.isActive === false || (req.body.role !== undefined && req.body.role !== 'admin'))) return res.status(400).json({ success: false, message: 'You cannot disable or demote your own admin account' });
  const updates = pick(req.body, resource === 'users' ? userFields : resourceFields[resource] || []);
  const record = await Model.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
  if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
  res.json({ success: true, record });
};

export const deleteResource = async (req, res) => {
  const { resource, id } = req.params;
  const Model = resources[resource];
  if (!Model) return res.status(404).json({ success: false, message: 'Unknown admin resource' });
  if (resource === 'users' && id === String(req.user._id)) return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
  const record = await Model.findByIdAndDelete(id);
  if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
  res.json({ success: true, message: 'Record deleted' });
};