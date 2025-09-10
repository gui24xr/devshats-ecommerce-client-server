const fs = require('fs');

// Leer el archivo JSON
const jsonData = JSON.parse(fs.readFileSync('src/data/mock-restaurant.json', 'utf8'));

// Leer las nuevas features
const newFeatures = JSON.parse(fs.readFileSync('temp_features.json', 'utf8'));

// Función para reemplazar features en un producto
function replaceFeatures(product) {
    if (product.customizationTemplate && product.customizationTemplate.features) {
        product.customizationTemplate.features = newFeatures;
    }
}

// Aplicar a todos los productos
jsonData.store.products.forEach(product => {
    replaceFeatures(product);
});

// Guardar el archivo actualizado
fs.writeFileSync('src/data/mock-restaurant.json', JSON.stringify(jsonData, null, 2), 'utf8');

console.log('Transformación completada para todos los productos');
console.log(`Total de productos procesados: ${jsonData.store.products.length}`);

