import User from '../models/User.js';
import { isStrongPassword, passwordRequirementsMessage } from '../utils/validatePassword.js';

export const getLawyers = async (req, res) => {
  try {
    const { city, area, q, online, sort = 'rating' } = req.query;
    const filter = { role: 'lawyer', isActive: true };

    if (city) filter.city = city;
    if (online === 'true') filter.online = true;
    if (area) filter.specialization = { $regex: area, $options: 'i' };
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { specialization: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
      ];
    }

    let query = User.find(filter).select('-password -bankAccountNumber -bankProvider');

    if (sort === 'rating') query = query.sort({ rating: -1 });
    else if (sort === 'fee-low') query = query.sort({ fee: 1 });
    else if (sort === 'fee-high') query = query.sort({ fee: -1 });
    else if (sort === 'exp') query = query.sort({ experience: -1 });

    const lawyers = await query;
    res.json({ success: true, count: lawyers.length, data: lawyers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLawyerById = async (req, res) => {
  try {
    const lawyer = await User.findOne({ _id: req.params.id, role: 'lawyer' }).select('-password -bankAccountNumber -bankProvider');
    if (!lawyer) {
      return res.status(404).json({ success: false, message: 'Lawyer not found' });
    }
    res.json({ success: true, data: lawyer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const registerAsLawyer = async (req, res) => {
  try {
    const {
      name, email, password, phone, city, gender,
      specialization, experience, barCouncil, education, bio,
      matricSchool, intermediateCollege, lawInstitution, casesHandled, casesCleared,
      bankAccountNumber,
      bankProvider,
    } = req.body;
    const qualificationFile = req.files?.qualificationDocument?.[0];
    const avatarFile = req.files?.avatar?.[0];

    if (!name || !email || !password || !qualificationFile || !avatarFile || !bankProvider?.trim() || !bankAccountNumber?.trim()) {
      return res.status(400).json({ success: false, message: 'Name, email, lawyer photo, payment provider, bank account number and qualification certificate or degree file required' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ success: false, message: passwordRequirementsMessage });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const lawyer = await User.create({
      name,
      email,
      password,
      phone,
      city: city || '',
      role: 'lawyer',
      specialization: specialization ? (Array.isArray(specialization) ? specialization : [specialization]) : [],
      experience: experience || 0,
      barCouncil: barCouncil || '',
      education: education?.trim() || '',
      matricSchool: matricSchool?.trim() || '',
      intermediateCollege: intermediateCollege?.trim() || '',
      lawInstitution: lawInstitution?.trim() || '',
      casesHandled: Number(casesHandled) || 0,
      casesCleared: Number(casesCleared) || 0,
      bankAccountNumber: bankAccountNumber.trim(),
      bankProvider: bankProvider.trim(),
      avatar: `/uploads/qualifications/${avatarFile.filename}`,
      qualificationDocument: `/uploads/qualifications/${qualificationFile.filename}`,
      bio: bio || '',
      verified: false,
      online: false,
    });

    res.status(201).json({
      success: true,
      message: 'Lawyer registration received. Our team will review within 5–6 working days.',
      data: lawyer.toPublicJSON(),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCities = (req, res) => {
  const cities = [
    'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Gujranwala', 'Sargodha', 'Bahawalpur',
    'Quetta', 'Hyderabad', 'Sialkot', 'Abbottabad', 'Sukkur',
  ];
  res.json({ success: true, data: cities });
};

export const getPracticeAreas = (req, res) => {
  const areas = [
    'Family Law', 'Criminal Defense', 'Property & Real Estate', 'Civil Litigation',
    'Corporate Law', 'Taxation', 'Employment & Labor', 'Immigration',
    'Intellectual Property', 'Constitutional Matters', 'Banking & Finance',
    'NAB / FIA Cases', 'Medical Negligence', 'Human Rights', 'Consumer Protection',
    'Environmental Law', 'Privacy & Cyber Crime', 'ADR', 'Bail / FIR',
  ];
  res.json({ success: true, data: areas });
};
