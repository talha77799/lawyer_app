import Review from '../models/Review.js';
import User from '../models/User.js';

export const createReview = async (req, res) => {
  try {
    const { lawyerId, rating, comment, appointmentId } = req.body;
    if (!lawyerId || !rating) {
      return res.status(400).json({ success: false, message: 'lawyerId and rating required' });
    }
    const review = await Review.create({
      lawyer: lawyerId,
      client: req.user._id,
      appointment: appointmentId,
      rating,
      comment: comment || '',
    });

    // Update lawyer rating
    const stats = await Review.aggregate([
      { $match: { lawyer: review.lawyer } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats[0]) {
      await User.findByIdAndUpdate(lawyerId, {
        rating: Math.round(stats[0].avg * 10) / 10,
        reviewsCount: stats[0].count,
      });
    }

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You already reviewed this lawyer' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLawyerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ lawyer: req.params.id })
      .populate('client', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
