// Script de seed pour les tests E2E (à adapter selon votre backend)
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function seed() {
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'users.json')));
  const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'courses.json')));

  // Nettoyage (optionnel, selon API backend)
  await axios.post('http://localhost:3000/test/clear');

  // Création des utilisateurs
  for (const user of users) {
    await axios.post('http://localhost:3000/auth/register', user);
  }

  // Création des cours
  for (const course of courses) {
    await axios.post('http://localhost:3000/classes', course);
  }

  console.log('Seed E2E terminé.');
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
