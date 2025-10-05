const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/mock-restaurant.json', 'utf8'));
const p = data.store.products[0];

console.log('First product check:');
console.log('- hasVariants:', p.hasVariants);
console.log('- isCustomizable:', p.isCustomizable);
console.log('- customizationTemplate:', p.customizationTemplate ? 'EXISTS' : 'MISSING');
console.log('- customizationFeaturesTemplate:', p.customizationFeaturesTemplate ? 'EXISTS' : 'MISSING');
