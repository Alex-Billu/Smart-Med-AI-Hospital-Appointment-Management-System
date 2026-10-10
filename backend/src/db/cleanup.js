const db = require('./database');

// Remove duplicate doctors - keep only first (lowest id) occurrence per name
const dupes = db.prepare(`
  DELETE FROM doctors WHERE id NOT IN (
    SELECT MIN(id) FROM doctors GROUP BY name
  )
`).run();
console.log('Removed duplicate doctors:', dupes.changes);

// Also clean orphaned schedules and appointments for deleted doctors
db.prepare(`DELETE FROM schedules WHERE doctor_id NOT IN (SELECT id FROM doctors)`).run();

// Add photo URLs to existing doctors
const photos = {
  'Dr. Arun Kumar':      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
  'Dr. Priya Shankar':   'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400',
  'Dr. Vignesh Kumar':   'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
  'Dr. Kavitha Devi':    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
  'Dr. Surya Narayanan': 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
  'Dr. Meena Krishnan':  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
  'Dr. Hari Prasad':     'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
  'Dr. Sanjay Raman':    'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400',
};

const updatePhoto = db.prepare(`UPDATE doctors SET photo_url = ? WHERE name = ?`);
for (const [name, url] of Object.entries(photos)) {
  const result = updatePhoto.run(url, name);
  console.log(`Photo set for ${name}:`, result.changes, 'rows');
}

// Verify final state
const doctors = db.prepare('SELECT id, name, photo_url, fee, experience FROM doctors ORDER BY id').all();
console.log('\nFinal doctors in DB:');
doctors.forEach(d => console.log(`  [${d.id}] ${d.name} | fee:${d.fee} | exp:${d.experience} | photo:${d.photo_url ? 'YES' : 'NO'}`));
