import Case from '../models/Case.js';

export const getMyCases = async (req, res) => {
  try {
    const filter =
      req.user.role === 'lawyer'
        ? { lawyer: req.user._id }
        : { client: req.user._id };

    const cases = await Case.find(filter)
      .populate('lawyer', 'name avatar specialization')
      .populate('client', 'name email phone city')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: cases.length, data: cases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const legalCase = await Case.findById(req.params.id)
      .populate('lawyer', 'name avatar specialization fee')
      .populate('client', 'name email phone city');

    if (!legalCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const isOwner =
      legalCase.client._id.toString() === req.user._id.toString() ||
      legalCase.lawyer._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: legalCase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCase = async (req, res) => {
  try {
    const { title, lawyerId, description, filedDate } = req.body;
    if (!title || !lawyerId) {
      return res.status(400).json({ success: false, message: 'title and lawyerId required' });
    }

    const legalCase = await Case.create({
      title,
      client: req.user._id,
      lawyer: lawyerId,
      description: description || '',
      filedDate: filedDate || new Date().toISOString().slice(0, 10),
      status: 'filed',
      progress: 10,
    });

    res.status(201).json({ success: true, data: legalCase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCase = async (req, res) => {
  try {
    const legalCase = await Case.findById(req.params.id);
    if (!legalCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const isLawyer = legalCase.lawyer.toString() === req.user._id.toString();
    if (!isLawyer && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only assigned lawyer can update case' });
    }

    const { status, progress, nextHearing, description } = req.body;
    if (status) legalCase.status = status;
    if (progress !== undefined) {
      const clamped = Math.min(100, Math.max(0, Number(progress) || 0));
      legalCase.progress = clamped;
    }
    if (nextHearing !== undefined) legalCase.nextHearing = nextHearing;
    if (description !== undefined) legalCase.description = description;

    await legalCase.save();
    res.json({ success: true, data: legalCase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
