import Appointment from '../models/Appointment.js';
import Case from '../models/Case.js';
import User from '../models/User.js';

export const getClientDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [appointments, cases] = await Promise.all([
      Appointment.find({ client: userId }).sort({ date: 1 }),
      Case.find({ client: userId }),
    ]);

    const upcoming = appointments.filter((a) => a.status === 'upcoming');
    const completed = appointments.filter((a) => a.status === 'completed');
    const totalSpent = appointments.reduce((sum, a) => sum + (a.fee || 0), 0);

    const onlineLawyers = await User.find({ role: 'lawyer', online: true, isActive: true })
      .select('name avatar specialization fee city rating')
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          upcomingAppointments: upcoming.length,
          activeCases: cases.length,
          completedSessions: completed.length,
          totalSpent,
        },
        upcomingAppointments: upcoming,
        cases,
        recommendedLawyers: onlineLawyers,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLawyerDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [appointments, cases] = await Promise.all([
      Appointment.find({ lawyer: userId }).sort({ date: 1 }),
      Case.find({ lawyer: userId }).populate('client', 'name email phone city'),
    ]);

    const upcoming = appointments.filter((a) => a.status === 'upcoming');
    const earnings = appointments.reduce((sum, a) => sum + (a.fee || 0), 0);

    const clientIds = [...new Set(appointments.map((a) => a.client.toString()))];
    const clients = await User.find({ _id: { $in: clientIds } }).select('name email phone city');

    res.json({
      success: true,
      data: {
        stats: {
          todayAppointments: upcoming.length,
          activeCases: cases.length,
          totalEarnings: earnings,
          rating: req.user.rating || 0,
          reviewsCount: req.user.reviewsCount || 0,
        },
        upcomingAppointments: upcoming,
        recentClients: clients,
        cases,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
