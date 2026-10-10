const db = require('./database');
const bcrypt = require('bcryptjs');

console.log('🌱 Seeding database...');

// ─── Departments ────────────────────────────────────────────────────────────
const departments = [
  { name: 'Cardiology', description: 'Heart and cardiovascular care', icon: 'heart', color: '#ef4444' },
  { name: 'Neurology', description: 'Brain and nervous system', icon: 'brain', color: '#8b5cf6' },
  { name: 'Orthopedics', description: 'Bones, joints and muscles', icon: 'bone', color: '#f59e0b' },
  { name: 'Dermatology', description: 'Skin, hair and nail care', icon: 'sparkles', color: '#ec4899' },
  { name: 'ENT', description: 'Ear, Nose and Throat', icon: 'ear', color: '#06b6d4' },
  { name: 'General Medicine', description: 'Primary healthcare', icon: 'stethoscope', color: '#10b981' },
  { name: 'Pediatrics', description: 'Child healthcare (0–18)', icon: 'baby', color: '#f97316' },
  { name: 'Gastroenterology', description: 'Digestive system care', icon: 'activity', color: '#84cc16' },
  { name: 'Nephrology', description: 'Kidney care', icon: 'droplets', color: '#3b82f6' },
  { name: 'Oncology', description: 'Cancer diagnosis & treatment', icon: 'microscope', color: '#6366f1' },
];

const insertDept = db.prepare(`
  INSERT OR IGNORE INTO departments (name, description, icon, color) VALUES (?, ?, ?, ?)
`);
departments.forEach(d => insertDept.run(d.name, d.description, d.icon, d.color));
console.log('✅ Departments seeded');

// ─── Admin User ─────────────────────────────────────────────────────────────
const adminPass = bcrypt.hashSync('admin@kmch123', 10);
db.prepare(`INSERT OR IGNORE INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`).run(
  'KMCH Admin', 'admin@kmch.com', '9000000001', adminPass, 'admin'
);
console.log('✅ Admin user created → admin@kmch.com / admin@kmch123');

// ─── Sample Patient ─────────────────────────────────────────────────────────
const patientPass = bcrypt.hashSync('patient123', 10);
db.prepare(`INSERT OR IGNORE INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`).run(
  'Alex Johnson', 'patient@kmch.com', '9000000002', patientPass, 'patient'
);
console.log('✅ Sample patient created → patient@kmch.com / patient123');

// ─── Doctors ────────────────────────────────────────────────────────────────
const doctorData = [
  {
    name: 'Dr. Arun Kumar', email: 'arun@kmch.com', phone: '9000000101',
    dept: 'Cardiology', spec: 'Interventional Cardiology', qual: 'MD, DM Cardiology – AIIMS',
    exp: 15, fee: 800, rating: 4.9, reviews: 312,
    bio: 'Senior cardiologist specializing in interventional procedures and heart failure management.',
    location: 'Block A, Room 204', initials: 'AK',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  {
    name: 'Dr. Priya Shankar', email: 'priya@kmch.com', phone: '9000000102',
    dept: 'Neurology', spec: 'Epilepsy & Movement Disorders', qual: 'MD, DM Neurology – CMC Vellore',
    exp: 12, fee: 1000, rating: 4.8, reviews: 245,
    bio: 'Specialist in epilepsy, Parkinson\'s disease, and complex neurological disorders.',
    location: 'Block B, Room 112', initials: 'PS',
    days: ['Monday', 'Wednesday', 'Friday'],
  },
  {
    name: 'Dr. Vignesh Kumar', email: 'vignesh@kmch.com', phone: '9000000103',
    dept: 'Orthopedics', spec: 'Joint Replacement & Sports Medicine', qual: 'MS Orthopedics – Madras Medical College',
    exp: 18, fee: 900, rating: 4.95, reviews: 520,
    bio: 'Expert in knee and hip replacement, arthroscopy, and sports injury rehabilitation.',
    location: 'Block A, Room 101', initials: 'VK',
    days: ['Tuesday', 'Thursday', 'Saturday'],
  },
  {
    name: 'Dr. Kavitha Devi', email: 'kavitha@kmch.com', phone: '9000000104',
    dept: 'Dermatology', spec: 'Cosmetic & Clinical Dermatology', qual: 'MD Dermatology – JIPMER',
    exp: 8, fee: 700, rating: 4.7, reviews: 189,
    bio: 'Specialist in acne, psoriasis, hair disorders and cosmetic dermatology procedures.',
    location: 'Block C, Room 305', initials: 'KD',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  {
    name: 'Dr. Surya Narayanan', email: 'surya@kmch.com', phone: '9000000105',
    dept: 'ENT', spec: 'Head, Neck & Sinus Surgery', qual: 'MS ENT – Stanley Medical College',
    exp: 10, fee: 600, rating: 4.8, reviews: 211,
    bio: 'ENT surgeon specializing in endoscopic sinus surgery and cochlear implants.',
    location: 'Block D, Room 210', initials: 'SN',
    days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
  },
  {
    name: 'Dr. Meena Krishnan', email: 'meena@kmch.com', phone: '9000000106',
    dept: 'General Medicine', spec: 'Internal Medicine & Diabetology', qual: 'MD General Medicine – Coimbatore Medical College',
    exp: 20, fee: 500, rating: 4.85, reviews: 602,
    bio: 'Experienced general physician with expertise in diabetes, hypertension, and chronic disease management.',
    location: 'OPD Block, Room 05', initials: 'MK',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  {
    name: 'Dr. Hari Prasad', email: 'hari@kmch.com', phone: '9000000107',
    dept: 'Pediatrics', spec: 'Neonatal & Pediatric Critical Care', qual: 'MD Pediatrics – PGIMER Chandigarh',
    exp: 11, fee: 600, rating: 4.8, reviews: 298,
    bio: 'Pediatric intensivist with special expertise in newborn care and childhood infectious diseases.',
    location: 'Block E, Room 102', initials: 'HP',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  {
    name: 'Dr. Sanjay Raman', email: 'sanjay@kmch.com', phone: '9000000108',
    dept: 'Gastroenterology', spec: 'Therapeutic Endoscopy & Liver Diseases', qual: 'DM Gastroenterology – AIIMS',
    exp: 13, fee: 1000, rating: 4.75, reviews: 176,
    bio: 'Gastroenterologist specializing in advanced endoscopy, IBD, and liver diseases.',
    location: 'Block B, Room 215', initials: 'SR',
    days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
];

const insertUser = db.prepare(`INSERT OR IGNORE INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`);
const insertDoctor = db.prepare(`
  INSERT OR IGNORE INTO doctors (user_id, department_id, name, specialization, qualification, experience, fee, rating, review_count, bio, location, initials)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const insertSchedule = db.prepare(`
  INSERT OR IGNORE INTO schedules (doctor_id, day_of_week, start_time, end_time, slot_duration)
  VALUES (?, ?, ?, ?, ?)
`);

const getDeptId = db.prepare(`SELECT id FROM departments WHERE name = ?`);
const getUserId = db.prepare(`SELECT id FROM users WHERE email = ?`);
const getDocId = db.prepare(`SELECT id FROM doctors WHERE name = ?`);

const doctorPass = bcrypt.hashSync('doctor123', 10);

doctorData.forEach(doc => {
  insertUser.run(doc.name, doc.email, doc.phone, doctorPass, 'doctor');
  const user = getUserId.get(doc.email);
  const dept = getDeptId.get(doc.dept);
  if (user && dept) {
    insertDoctor.run(user.id, dept.id, doc.name, doc.spec, doc.qual, doc.exp, doc.fee, doc.rating, doc.reviews, doc.bio, doc.location, doc.initials);
    const doctor = getDocId.get(doc.name);
    if (doctor) {
      doc.days.forEach(day => {
        insertSchedule.run(doctor.id, day, '09:00', '17:00', 30);
      });
    }
  }
});

console.log('✅ Doctors seeded (password: doctor123)');
console.log('');
console.log('─────────────────────────────────');
console.log('Seed complete! Demo credentials:');
console.log('  Admin   : admin@kmch.com / admin@kmch123');
console.log('  Patient : patient@kmch.com / patient123');
console.log('  Doctor  : arun@kmch.com / doctor123');
console.log('─────────────────────────────────');
