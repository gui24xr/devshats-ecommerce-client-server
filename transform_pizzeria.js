const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/mock-pizzeria.json', 'utf8'));

data.store.products.forEach(product => {
  // Remove hasVariants and isCustomizable
  delete product.hasVariants;
  delete product.isCustomizable;

  // Rename customizationTemplate to customizationFeaturesTemplate
  if (product.customizationTemplate !== undefined) {
    product.customizationFeaturesTemplate = product.customizationTemplate;
    delete product.customizationTemplate;
  }

  // If customizationFeaturesTemplate is an object with features, make it the array
  if (product.customizationFeaturesTemplate && typeof product.customizationFeaturesTemplate === 'object' && product.customizationFeaturesTemplate.features) {
    product.customizationFeaturesTemplate = product.customizationFeaturesTemplate.features;
  }
});

fs.writeFileSync('src/data/mock-pizzeria.json', JSON.stringify(data, null, 2));