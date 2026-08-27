export interface Lawyer {
  id: string;
  name: string;
  photo: string;
  specialization: string[];
  city: string;
  experience: number;
  rating: number;
  reviews: number;
  fee: number;
  verified: boolean;
  online: boolean;
  bio: string;
  languages: string[];
  education: string;
  matricSchool?: string;
  intermediateCollege?: string;
  lawInstitution?: string;
  casesHandled?: number;
  casesCleared?: number;
  bankAccountNumber?: string;
  bankProvider?: string;
  barCouncil: string;
  location: string;
  availability: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  cases: number;
}

export interface Appointment {
  id: string;
  lawyerId: string;
  clientId: string;
  lawyerName: string;
  clientName: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
  fee: number;
  notes?: string;
}

export interface Case {
  id: string;
  title: string;
  clientId: string;
  lawyerId: string;
  status: 'filed' | 'hearing' | 'judgment' | 'closed';
  progress: number;
  filedDate: string;
  nextHearing?: string;
  description: string;
}

export const cities = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Gujranwala', 'Sargodha', 'Bahawalpur',
  'Quetta', 'Hyderabad', 'Sialkot', 'Abbottabad', 'Sukkur'
];

export const practiceAreas = [
  'Family Law', 'Criminal Defense', 'Property & Real Estate', 'Civil Litigation',
  'Corporate Law', 'Taxation', 'Employment & Labor', 'Immigration',
  'Intellectual Property', 'Constitutional Matters', 'Banking & Finance',
  'NAB / FIA Cases', 'Medical Negligence', 'Human Rights', 'Consumer Protection',
  'Environmental Law', 'Privacy & Cyber Crime', 'ADR', 'Bail / FIR'
];

export const lawyers: Lawyer[] = [
  {
    id: 'l1',
    name: 'Adv. Ayesha Khan',
    photo: 'https://i.pravatar.cc/150?img=1',
    specialization: ['Family Law', 'Civil Litigation'],
    city: 'Lahore',
    experience: 12,
    rating: 4.9,
    reviews: 128,
    fee: 5000,
    verified: true,
    online: true,
    bio: 'Experienced family law specialist with over a decade of practice in Lahore High Court. Expert in divorce, custody, and inheritance matters.',
    languages: ['Urdu', 'English', 'Punjabi'],
    education: 'LLB - University of Punjab, LLM - LUMS',
    matricSchool: 'Lahore Grammar School',
    intermediateCollege: 'Kinnaird College for Women',
    lawInstitution: 'University of Punjab Law College',
    casesHandled: 340,
    casesCleared: 275,
    bankAccountNumber: 'PK12 VRDL 0000 1234 5678',
    bankProvider: 'HBL',
    barCouncil: 'Punjab Bar Council',
    location: 'Gulberg III, Lahore',
    availability: ['Mon 10:00', 'Tue 14:00', 'Wed 11:00', 'Thu 15:00', 'Fri 10:00']
  },
  {
    id: 'l2',
    name: 'Adv. Bilal Ahmed',
    photo: 'https://i.pravatar.cc/150?img=11',
    specialization: ['Criminal Defense', 'Bail / FIR', 'NAB / FIA Cases'],
    city: 'Karachi',
    experience: 15,
    rating: 4.8,
    reviews: 95,
    fee: 8000,
    verified: true,
    online: true,
    bio: 'Senior criminal defense lawyer specializing in white-collar crime, NAB cases, and high-profile criminal matters across Sindh.',
    languages: ['Urdu', 'English', 'Sindhi'],
    education: 'LLB - University of Karachi, Bar-at-Law - Lincoln\'s Inn',
    barCouncil: 'Sindh Bar Council',
    bankAccountNumber: 'PK12 VRDL 0000 2234 5678',
    bankProvider: 'UBL',
    location: 'Clifton, Karachi',
    availability: ['Mon 09:00', 'Tue 11:00', 'Wed 14:00', 'Thu 10:00', 'Sat 11:00']
  },
  {
    id: 'l3',
    name: 'Adv. Sara Malik',
    photo: 'https://i.pravatar.cc/150?img=5',
    specialization: ['Property & Real Estate', 'Civil Litigation'],
    city: 'Islamabad',
    experience: 9,
    rating: 4.7,
    reviews: 76,
    fee: 4500,
    verified: true,
    online: false,
    bio: 'Property and real estate expert handling title disputes, property transfers, and commercial leasing in the capital region.',
    languages: ['Urdu', 'English'],
    education: 'LLB - Quaid-i-Azam University',
    barCouncil: 'Islamabad Bar Council',
    bankAccountNumber: 'PK12 VRDL 0000 3234 5678',
    bankProvider: 'MCB',
    location: 'F-7 Markaz, Islamabad',
    availability: ['Mon 11:00', 'Wed 15:00', 'Thu 12:00', 'Fri 14:00']
  },
  {
    id: 'l4',
    name: 'Adv. Usman Raza',
    photo: 'https://i.pravatar.cc/150?img=12',
    specialization: ['Corporate Law', 'Taxation', 'Banking & Finance'],
    city: 'Lahore',
    experience: 18,
    rating: 4.9,
    reviews: 210,
    fee: 12000,
    verified: true,
    online: true,
    bio: 'Corporate counsel with extensive experience in company law, tax advisory, and banking regulations. Advises startups and multinationals.',
    languages: ['Urdu', 'English'],
    education: 'LLB - University of London, LLM - Harvard Law School',
    barCouncil: 'Punjab Bar Council',
    bankAccountNumber: 'PK12 VRDL 0000 4234 5678',
    bankProvider: 'Meezan Bank',
    location: 'DHA Phase 5, Lahore',
    availability: ['Tue 10:00', 'Wed 10:00', 'Thu 14:00', 'Fri 11:00']
  },
  {
    id: 'l5',
    name: 'Adv. Fatima Noor',
    photo: 'https://i.pravatar.cc/150?img=9',
    specialization: ['Human Rights', 'Constitutional Matters', 'Immigration'],
    city: 'Peshawar',
    experience: 11,
    rating: 4.6,
    reviews: 54,
    fee: 4000,
    verified: true,
    online: true,
    bio: 'Human rights advocate and constitutional lawyer working on fundamental rights petitions and immigration cases.',
    languages: ['Urdu', 'English', 'Pashto'],
    education: 'LLB - University of Peshawar',
    barCouncil: 'KP Bar Council',
    bankAccountNumber: 'PK12 VRDL 0000 5234 5678',
    bankProvider: 'EasyPaisa',
    location: 'University Road, Peshawar',
    availability: ['Mon 14:00', 'Tue 10:00', 'Thu 11:00', 'Fri 15:00']
  },
  {
    id: 'l6',
    name: 'Adv. Hamza Siddiqui',
    photo: 'https://i.pravatar.cc/150?img=13',
    specialization: ['Employment & Labor', 'Consumer Protection'],
    city: 'Faisalabad',
    experience: 7,
    rating: 4.5,
    reviews: 42,
    fee: 3500,
    verified: true,
    online: false,
    bio: 'Labor law specialist helping employees and employers with workplace disputes, contracts, and compliance.',
    languages: ['Urdu', 'English', 'Punjabi'],
    education: 'LLB - GC University Faisalabad',
    barCouncil: 'Punjab Bar Council',
    bankAccountNumber: 'PK12 VRDL 0000 6234 5678',
    bankProvider: 'JazzCash',
    location: 'Madina Town, Faisalabad',
    availability: ['Mon 12:00', 'Wed 11:00', 'Fri 10:00', 'Sat 14:00']
  },
  {
    id: 'l7',
    name: 'Adv. Zainab Ali',
    photo: 'https://i.pravatar.cc/150?img=10',
    specialization: ['Family Law', 'Medical Negligence'],
    city: 'Multan',
    experience: 10,
    rating: 4.8,
    reviews: 89,
    fee: 4000,
    verified: true,
    online: true,
    bio: 'Dedicated family lawyer and medical negligence specialist providing compassionate legal support in Southern Punjab.',
    languages: ['Urdu', 'English', 'Saraiki'],
    education: 'LLB - Bahauddin Zakariya University',
    barCouncil: 'Punjab Bar Council',
    bankAccountNumber: 'PK12 VRDL 0000 7234 5678',
    bankProvider: 'Bank Alfalah',
    location: 'Cantt, Multan',
    availability: ['Tue 09:00', 'Wed 13:00', 'Thu 10:00', 'Fri 12:00']
  },
  {
    id: 'l8',
    name: 'Adv. Omar Farooq',
    photo: 'https://i.pravatar.cc/150?img=15',
    specialization: ['Privacy & Cyber Crime', 'Intellectual Property'],
    city: 'Islamabad',
    experience: 8,
    rating: 4.7,
    reviews: 63,
    fee: 6000,
    verified: true,
    online: true,
    bio: 'Cyber crime and IP specialist assisting clients with digital privacy, online fraud, trademarks, and copyright matters.',
    languages: ['Urdu', 'English'],
    education: 'LLB - IIUI, Diploma in Cyber Law',
    barCouncil: 'Islamabad Bar Council',
    bankAccountNumber: 'PK12 VRDL 0000 8234 5678',
    bankProvider: 'HBL',
    location: 'Blue Area, Islamabad',
    availability: ['Mon 15:00', 'Tue 11:00', 'Thu 14:00', 'Sat 10:00']
  }
];

export const clients: Client[] = [
  { id: 'c1', name: 'Ali Hassan', email: 'ali.hassan@email.com', phone: '+92 300 1234567', city: 'Lahore', cases: 2 },
  { id: 'c2', name: 'Maria Khan', email: 'maria.k@email.com', phone: '+92 321 9876543', city: 'Karachi', cases: 1 },
  { id: 'c3', name: 'Ahmed Raza', email: 'ahmed.raza@email.com', phone: '+92 333 5556677', city: 'Islamabad', cases: 3 },
  { id: 'c4', name: 'Sana Iqbal', email: 'sana.iqbal@email.com', phone: '+92 345 1122334', city: 'Lahore', cases: 1 },
  { id: 'c5', name: 'Bilal Shah', email: 'bilal.shah@email.com', phone: '+92 301 9988776', city: 'Peshawar', cases: 2 },
];

export const appointments: Appointment[] = [
  { id: 'a1', lawyerId: 'l1', clientId: 'c1', lawyerName: 'Adv. Ayesha Khan', clientName: 'Ali Hassan', date: '2026-08-15', time: '10:00', type: 'video', status: 'upcoming', fee: 5000 },
  { id: 'a2', lawyerId: 'l2', clientId: 'c2', lawyerName: 'Adv. Bilal Ahmed', clientName: 'Maria Khan', date: '2026-08-14', time: '11:00', type: 'in-person', status: 'upcoming', fee: 8000 },
  { id: 'a3', lawyerId: 'l4', clientId: 'c3', lawyerName: 'Adv. Usman Raza', clientName: 'Ahmed Raza', date: '2026-08-10', time: '14:00', type: 'video', status: 'completed', fee: 12000 },
  { id: 'a4', lawyerId: 'l1', clientId: 'c4', lawyerName: 'Adv. Ayesha Khan', clientName: 'Sana Iqbal', date: '2026-08-18', time: '15:00', type: 'video', status: 'upcoming', fee: 5000 },
  { id: 'a5', lawyerId: 'l5', clientId: 'c5', lawyerName: 'Adv. Fatima Noor', clientName: 'Bilal Shah', date: '2026-08-12', time: '10:00', type: 'in-person', status: 'upcoming', fee: 4000 },
];

export const cases: Case[] = [
  { id: 'case1', title: 'Divorce & Child Custody', clientId: 'c1', lawyerId: 'l1', status: 'hearing', progress: 45, filedDate: '2026-05-12', nextHearing: '2026-08-20', description: 'Family dispute regarding divorce and custody of two minor children.' },
  { id: 'case2', title: 'Property Title Dispute', clientId: 'c3', lawyerId: 'l3', status: 'filed', progress: 20, filedDate: '2026-07-01', nextHearing: '2026-08-25', description: 'Dispute over ancestral property title in Islamabad.' },
  { id: 'case3', title: 'Corporate Tax Assessment Appeal', clientId: 'c3', lawyerId: 'l4', status: 'hearing', progress: 60, filedDate: '2026-03-15', nextHearing: '2026-08-16', description: 'Appeal against tax assessment order for FY 2024-25.' },
  { id: 'case4', title: 'Cyber Fraud Complaint', clientId: 'c2', lawyerId: 'l8', status: 'filed', progress: 15, filedDate: '2026-07-28', description: 'Online banking fraud case involving unauthorized transactions.' },
];

export const currentUser = {
  id: 'c1',
  name: 'Hassan_Mehmood',
  role: 'client' as 'client' | 'lawyer',
  email: 'ali.hassan@email.com'
};
