import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Appointment from '../src/models/Appointment.js';
import Case from '../src/models/Case.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vr_digital';

const lawyersData = [
  {
    name: 'Adv. Ayesha Khan',
    email: 'ayesha.khan@vrdigital.pk',
    password: 'password123',
    phone: '+92 300 1111111',
    role: 'lawyer',
    city: 'Lahore',
    specialization: ['Family Law', 'Civil Litigation'],
    experience: 12,
    fee: 5000,
    verified: true,
    online: true,
    bio: 'Experienced family law specialist with over a decade of practice in Lahore High Court.',
    languages: ['Urdu', 'English', 'Punjabi'],
    education: 'LLB - University of Punjab, LLM - LUMS',
    barCouncil: 'Punjab Bar Council',
    location: 'Gulberg III, Lahore',
    availability: ['Mon 10:00', 'Tue 14:00', 'Wed 11:00', 'Thu 15:00', 'Fri 10:00'],
    rating: 4.9,
    reviewsCount: 128,
  },
  {
    name: 'Adv. Bilal Ahmed',
    email: 'bilal.ahmed@vrdigital.pk',
    password: 'password123',
    phone: '+92 300 2222222',
    role: 'lawyer',
    city: 'Karachi',
    specialization: ['Criminal Defense', 'Bail / FIR', 'NAB / FIA Cases'],
    experience: 15,
    fee: 8000,
    verified: true,
    online: true,
    bio: 'Senior criminal defense lawyer specializing in white-collar crime and NAB cases.',
    languages: ['Urdu', 'English', 'Sindhi'],
    education: "LLB - University of Karachi, Bar-at-Law - Lincoln's Inn",
    barCouncil: 'Sindh Bar Council',
    location: 'Clifton, Karachi',
    availability: ['Mon 09:00', 'Tue 11:00', 'Wed 14:00', 'Thu 10:00', 'Sat 11:00'],
    rating: 4.8,
    reviewsCount: 95,
  },
  {
    name: 'Adv. Sara Malik',
    email: 'sara.malik@vrdigital.pk',
    password: 'password123',
    phone: '+92 300 3333333',
    role: 'lawyer',
    city: 'Islamabad',
    specialization: ['Property & Real Estate', 'Civil Litigation'],
    experience: 9,
    fee: 4500,
    verified: true,
    online: false,
    bio: 'Property and real estate expert handling title disputes and commercial leasing.',
    languages: ['Urdu', 'English'],
    education: 'LLB - Quaid-i-Azam University',
    barCouncil: 'Islamabad Bar Council',
    location: 'F-7 Markaz, Islamabad',
    availability: ['Mon 11:00', 'Wed 15:00', 'Thu 12:00', 'Fri 14:00'],
    rating: 4.7,
    reviewsCount: 76,
  },
  {
    name: 'Adv. Usman Raza',
    email: 'usman.raza@vrdigital.pk',
    password: 'password123',
    phone: '+92 300 4444444',
    role: 'lawyer',
    city: 'Lahore',
    specialization: ['Corporate Law', 'Taxation', 'Banking & Finance'],
    experience: 18,
    fee: 12000,
    verified: true,
    online: true,
    bio: 'Corporate counsel with extensive experience in company law and tax advisory.',
    languages: ['Urdu', 'English'],
    education: 'LLB - University of London, LLM - Harvard Law School',
    barCouncil: 'Punjab Bar Council',
    location: 'DHA Phase 5, Lahore',
    availability: ['Tue 10:00', 'Wed 10:00', 'Thu 14:00', 'Fri 11:00'],
    rating: 4.9,
    reviewsCount: 210,
  },
  {
    name: 'Adv. Fatima Noor',
    email: 'fatima.noor@vrdigital.pk',
    password: 'password123',
    phone: '+92 300 5555555',
    role: 'lawyer',
    city: 'Peshawar',
    specialization: ['Human Rights', 'Constitutional Matters', 'Immigration'],
    experience: 11,
    fee: 4000,
    verified: true,
    online: true,
    bio: 'Human rights advocate and constitutional lawyer.',
    languages: ['Urdu', 'English', 'Pashto'],
    education: 'LLB - University of Peshawar',
    barCouncil: 'KP Bar Council',
    location: 'University Road, Peshawar',
    availability: ['Mon 14:00', 'Tue 10:00', 'Thu 11:00', 'Fri 15:00'],
    rating: 4.6,
    reviewsCount: 54,
  },
  {
    name: 'Adv. Hamza Siddiqui',
    email: 'hamza.siddiqui@vrdigital.pk',
    password: 'password123',
    phone: '+92 300 6666666',
    role: 'lawyer',
    city: 'Faisalabad',
    specialization: ['Employment & Labor', 'Consumer Protection'],
    experience: 7,
    fee: 3500,
    verified: true,
    online: false,
    bio: 'Labor law specialist helping employees and employers with workplace disputes.',
    languages: ['Urdu', 'English', 'Punjabi'],
    education: 'LLB - GC University Faisalabad',
    barCouncil: 'Punjab Bar Council',
    location: 'Madina Town, Faisalabad',
    availability: ['Mon 12:00', 'Wed 11:00', 'Fri 10:00', 'Sat 14:00'],
    rating: 4.5,
    reviewsCount: 42,
  },
  {
    name: 'Adv. Zainab Ali',
    email: 'zainab.ali@vrdigital.pk',
    password: 'password123',
    phone: '+92 300 7777777',
    role: 'lawyer',
    city: 'Multan',
    specialization: ['Family Law', 'Medical Negligence'],
    experience: 10,
    fee: 4000,
    verified: true,
    online: true,
    bio: 'Dedicated family lawyer and medical negligence specialist.',
    languages: ['Urdu', 'English', 'Saraiki'],
    education: 'LLB - Bahauddin Zakariya University',
    barCouncil: 'Punjab Bar Council',
    location: 'Cantt, Multan',
    availability: ['Tue 09:00', 'Wed 13:00', 'Thu 10:00', 'Fri 12:00'],
    rating: 4.8,
    reviewsCount: 89,
  },
  {
    name: 'Adv. Omar Farooq',
    email: 'omar.farooq@vrdigital.pk',
    password: 'password123',
    phone: '+92 300 8888888',
    role: 'lawyer',
    city: 'Islamabad',
    specialization: ['Privacy & Cyber Crime', 'Intellectual Property'],
    experience: 8,
    fee: 6000,
    verified: true,
    online: true,
    bio: 'Cyber crime and IP specialist assisting with digital privacy and trademarks.',
    languages: ['Urdu', 'English'],
    education: 'LLB - IIUI, Diploma in Cyber Law',
    barCouncil: 'Islamabad Bar Council',
    location: 'Blue Area, Islamabad',
    availability: ['Mon 15:00', 'Tue 11:00', 'Thu 14:00', 'Sat 10:00'],
    rating: 4.7,
    reviewsCount: 63,
  },
];

const clientsData = [
  {
    name: 'Hassan Mehmood',
    email: 'hassan.mehmood@email.com',
    password: 'password123',
    phone: '+92 300 1234567',
    role: 'client',
    city: 'Lahore',
  },
  {
    name: 'Maria Khan',
    email: 'maria.k@email.com',
    password: 'password123',
    phone: '+92 321 9876543',
    role: 'client',
    city: 'Karachi',
  },
  {
    name: 'Ahmed Raza',
    email: 'ahmed.raza@email.com',
    password: 'password123',
    phone: '+92 333 5556677',
    role: 'client',
    city: 'Islamabad',
  },
  {
    name: 'Sana Iqbal',
    email: 'sana.iqbal@email.com',
    password: 'password123',
    phone: '+92 345 1122334',
    role: 'client',
    city: 'Lahore',
  },
  {
    name: 'Bilal Shah',
    email: 'bilal.shah@email.com',
    password: 'password123',
    phone: '+92 301 9988776',
    role: 'client',
    city: 'Peshawar',
  },
];

const adminData = {
  name: 'VR-Digital Owner', email: process.env.ADMIN_EMAIL || 'owner@vrdigital.pk',
  password: process.env.ADMIN_PASSWORD || 'change-this-admin-password', role: 'admin', emailVerified: true,
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Appointment.deleteMany({}),
      Case.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    const lawyers = await Promise.all(
      lawyersData.map((lawyer) => User.create({
        ...lawyer,
        qualificationDocument: lawyer.qualificationDocument || '/uploads/qualifications/demo-certificate.pdf',
      }))
    );
    const clients = await Promise.all(clientsData.map((client) => User.create(client)));
    const admin = await User.create(adminData);
    console.log(`Seeded ${lawyers.length} lawyers, ${clients.length} clients and admin ${admin.email}`);

    const hassan = clients.find((c) => c.email === 'hassan.mehmood@email.com');
    const maria = clients.find((c) => c.email === 'maria.k@email.com');
    const ahmed = clients.find((c) => c.email === 'ahmed.raza@email.com');
    const sana = clients.find((c) => c.email === 'sana.iqbal@email.com');
    const bilal = clients.find((c) => c.email === 'bilal.shah@email.com');

    const ayesha = lawyers.find((l) => l.email === 'ayesha.khan@vrdigital.pk');
    const bilalAdv = lawyers.find((l) => l.email === 'bilal.ahmed@vrdigital.pk');
    const usman = lawyers.find((l) => l.email === 'usman.raza@vrdigital.pk');
    const fatima = lawyers.find((l) => l.email === 'fatima.noor@vrdigital.pk');
    const sara = lawyers.find((l) => l.email === 'sara.malik@vrdigital.pk');
    const omar = lawyers.find((l) => l.email === 'omar.farooq@vrdigital.pk');

    await Appointment.insertMany([
      {
        lawyer: ayesha._id,
        client: hassan._id,
        lawyerName: ayesha.name,
        clientName: hassan.name,
        date: '2026-08-15',
        time: '10:00',
        type: 'video',
        status: 'upcoming',
        fee: 5000,
      },
      {
        lawyer: bilalAdv._id,
        client: maria._id,
        lawyerName: bilalAdv.name,
        clientName: maria.name,
        date: '2026-08-14',
        time: '11:00',
        type: 'in-person',
        status: 'upcoming',
        fee: 8000,
      },
      {
        lawyer: usman._id,
        client: ahmed._id,
        lawyerName: usman.name,
        clientName: ahmed.name,
        date: '2026-08-10',
        time: '14:00',
        type: 'video',
        status: 'completed',
        fee: 12000,
      },
      {
        lawyer: ayesha._id,
        client: sana._id,
        lawyerName: ayesha.name,
        clientName: sana.name,
        date: '2026-08-18',
        time: '15:00',
        type: 'video',
        status: 'upcoming',
        fee: 5000,
      },
      {
        lawyer: fatima._id,
        client: bilal._id,
        lawyerName: fatima.name,
        clientName: bilal.name,
        date: '2026-08-12',
        time: '10:00',
        type: 'in-person',
        status: 'upcoming',
        fee: 4000,
      },
    ]);
    console.log('Seeded appointments');

    await Case.insertMany([
      {
        title: 'Divorce & Child Custody',
        client: hassan._id,
        lawyer: ayesha._id,
        status: 'hearing',
        progress: 45,
        filedDate: '2026-05-12',
        nextHearing: '2026-08-20',
        description: 'Family dispute regarding divorce and custody of two minor children.',
      },
      {
        title: 'Property Title Dispute',
        client: ahmed._id,
        lawyer: sara._id,
        status: 'filed',
        progress: 20,
        filedDate: '2026-07-01',
        nextHearing: '2026-08-25',
        description: 'Dispute over ancestral property title in Islamabad.',
      },
      {
        title: 'Corporate Tax Assessment Appeal',
        client: ahmed._id,
        lawyer: usman._id,
        status: 'hearing',
        progress: 60,
        filedDate: '2026-03-15',
        nextHearing: '2026-08-16',
        description: 'Appeal against tax assessment order for FY 2024-25.',
      },
      {
        title: 'Cyber Fraud Complaint',
        client: maria._id,
        lawyer: omar._id,
        status: 'filed',
        progress: 15,
        filedDate: '2026-07-28',
        description: 'Online banking fraud case involving unauthorized transactions.',
      },
    ]);
    console.log('Seeded cases');

    console.log('\n✅ Seed completed successfully!');
    console.log('\nDemo logins (password for all: password123):');
    console.log('  Client : hassan.mehmood@email.com');
    console.log('  Lawyer : ayesha.khan@vrdigital.pk');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
