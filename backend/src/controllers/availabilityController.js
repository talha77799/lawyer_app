import Availability from '../models/Availability.js';

export const getMyAvailability = async (req, res) => {
  try {
    let doc = await Availability.findOne({ lawyer: req.user._id });
    if (!doc) {
      doc = await Availability.create({ lawyer: req.user._id, schedule: [] });
    }
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { feeVideo, feeInPerson, cities, schedule } = req.body;
    const doc = await Availability.findOneAndUpdate(
      { lawyer: req.user._id },
      {
        ...(feeVideo !== undefined && { feeVideo }),
        ...(feeInPerson !== undefined && { feeInPerson }),
        ...(cities && { cities }),
        ...(schedule && { schedule }),
      },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLawyerAvailability = async (req, res) => {
  try {
    const doc = await Availability.findOne({ lawyer: req.params.id });
    res.json({ success: true, data: doc || { schedule: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
