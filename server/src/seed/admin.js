import { connectDatabase, disconnectDatabase } from '../config/db.js';
import User from '../models/User.js';
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } from './adminCredentials.js';

async function seedAdmin() {
  await connectDatabase();

  let admin = await User.findOne({ email: ADMIN_EMAIL });

  if (!admin) {
    admin = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      isActive: true,
    });
  } else {
    admin.name = admin.name || ADMIN_NAME;
    admin.role = 'admin';
    admin.isActive = true;
    admin.password = ADMIN_PASSWORD;
  }

  await admin.save();

  console.log('[seed:admin] Admin account ready');
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log('  Login:    /admin/login');
}

seedAdmin()
  .then(async () => {
    await disconnectDatabase();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('[seed:admin] Failed:', error);
    await disconnectDatabase().catch(() => {});
    process.exit(1);
  });
