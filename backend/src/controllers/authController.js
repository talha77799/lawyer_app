import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { isStrongPassword, passwordRequirementsMessage } from '../utils/validatePassword.js';

export const register = async (req, res) => {
  try {
    const {
      name, email, password, phone, role, city, education,
      matricSchool, intermediateCollege, lawInstitution, casesHandled, casesCleared,
      bankAccountNumber,
      bankProvider,
    } = req.body;
    const qualificationFile = req.files?.qualificationDocument?.[0];
    const avatarFile = req.files?.avatar?.[0];
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ success: false, message: passwordRequirementsMessage });
    }
    if (role === 'lawyer' && (!qualificationFile || !avatarFile)) {
      return res.status(400).json({ success: false, message: 'A lawyer photo and law qualification certificate or degree file are required for lawyer registration' });
    }
    if (role === 'client' && !avatarFile) {
      return res.status(400).json({ success: false, message: 'A profile photo is required for client registration' });
    }
    if (role === 'lawyer' && (!bankProvider?.trim() || !bankAccountNumber?.trim())) {
      return res.status(400).json({ success: false, message: 'A lawyer payment provider and account number are required for registration' });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({
      name,
      email,
      emailVerified: false,
      password,
      phone,
      role: role === 'lawyer' ? 'lawyer' : 'client',
      city: city || '',
      education: education?.trim() || '',
      matricSchool: matricSchool?.trim() || '',
      intermediateCollege: intermediateCollege?.trim() || '',
      lawInstitution: lawInstitution?.trim() || '',
      casesHandled: role === 'lawyer' ? Number(casesHandled) || 0 : 0,
      casesCleared: role === 'lawyer' ? Number(casesCleared) || 0 : 0,
      bankAccountNumber: role === 'lawyer' ? bankAccountNumber.trim() : '',
      bankProvider: role === 'lawyer' ? bankProvider.trim() : '',
      avatar: avatarFile ? `/uploads/qualifications/${avatarFile.filename}` : '',
      qualificationDocument: qualificationFile ? `/uploads/qualifications/${qualificationFile.filename}` : '',
    });
    res.status(201).json({
      success: true,
      message: 'Registration created. Verify your email to continue.',
      requiresVerification: true,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!user.emailVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email before logging in' });
    }
    if (user.role === 'lawyer' && !user.verified) {
      return res.status(403).json({ success: false, message: 'Your lawyer application is still under review. We\'ll email you once it\'s approved.' });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const avatarFile = req.files?.avatar?.[0];
    const qualificationFile = req.files?.qualificationDocument?.[0];
    const allowed = [
      'name', 'phone', 'city', 'avatar', 'bio', 'specialization',
      'experience', 'fee', 'languages', 'education', 'matricSchool',
      'intermediateCollege', 'lawInstitution', 'casesHandled', 'casesCleared', 'barCouncil',
      'qualificationDocument',
      'bankAccountNumber',
      'bankProvider',
      'location', 'availability', 'online',
    ];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    if (avatarFile) updates.avatar = `/uploads/qualifications/${avatarFile.filename}`;
    if (qualificationFile) updates.qualificationDocument = `/uploads/qualifications/${qualificationFile.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
