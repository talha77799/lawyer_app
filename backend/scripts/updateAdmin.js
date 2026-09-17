import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI;

async function updateAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'hasan@fugen.tech';
    const adminPassword = process.env.ADMIN_PASSWORD || '*_S28H24h25"mG"mtskU18_*';

    // Find any existing admin or search by role
    let admin = await User.findOne({ role: 'admin' });

    if (admin) {
      admin.email = adminEmail;
      admin.password = adminPassword;
      admin.name = 'Admin';
      admin.emailVerified = true;
      await admin.save();
      console.log(`✅ Admin account updated to email: ${admin.email}`);
    } else {
      admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        emailVerified: true,
      });
      console.log(`✅ New Admin account created: ${admin.email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin:', error);
    process.exit(1);
  }
}

updateAdmin();
