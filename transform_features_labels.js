const fs = require('fs');
const path = require('path');

// Función para generar el label basado en el name
function generateLabel(name) {
  // Convertir a título más descriptivo
  const labels = {
    'ingredientes_adicionales': 'Ingredientes Adicionales',
    'salsas': 'Salsas',
    'nivel_picante': 'Nivel de Picante',
    'tamaño': 'Tamaño',
    'tipo_pan': 'Tipo de Pan',
    'bebidas': 'Bebidas',
    'acompañamientos': 'Acompañamientos',
    'extras': 'Extras'
  };
  
  return labels[name] || name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');
}

// Función para generar la descripción basada en las constraints
function generateDescription(feature) {
  const { type, constraints } = feature;
  
  switch (type) {
    case 'check':
      const minSel = constraints.minSelection || 0;
      const maxSel = constraints.maxSelection;
      const required = constraints.required;
      
      if (required && minSel > 0) {
        if (maxSel && maxSel !== minSel) {
          return `Puedes elegir entre ${minSel} y ${maxSel} opciones.`;
        } else if (minSel === 1) {
          return `Debes elegir al menos 1 opción.`;
        } else {
          return `Debes elegir exactamente ${minSel} opciones.`;
        }
      } else if (maxSel) {
        return `Puedes elegir hasta ${maxSel} opciones.`;
      } else {
        return `Puedes elegir las opciones que desees.`;
      }
      
    case 'combo':
      const minTotal = constraints.minTotal || 0;
      const maxTotal = constraints.maxTotal;
      const minPerOption = constraints.minPerOption || 0;
      const maxPerOption = constraints.maxPerOption;
      const required = constraints.required;
      
      let desc = '';
      if (required) {
        desc += 'Obligatorio. ';
      }
      
      if (maxTotal > 0) {
        desc += `Puedes elegir hasta ${maxTotal} elementos en total. `;
      }
      
      if (maxPerOption > 0) {
        desc += `Máximo ${maxPerOption} por opción.`;
      }
      
      return desc.trim() || 'Personaliza tu selección.';
      
    case 'variant':
      const isRequired = constraints.required;
      const hasDefault = constraints.hasDefault;
      
      if (isRequired) {
        return 'Debes elegir una opción.';
      } else if (hasDefault) {
        return 'Elige una opción (hay una por defecto).';
      } else {
        return 'Elige una opción.';
      }
      
    default:
      return 'Personaliza tu selección.';
  }
}

// Función para transformar las features
function transformFeatures(features) {
  return features.map(feature => {
    const transformedFeature = {
      ...feature,
      label: generateLabel(feature.name),
      description: generateDescription(feature)
    };
    
    // Mantener el name original pero agregar los nuevos campos
    return transformedFeature;
  });
}

// Función principal
function transformRestaurantData() {
  try {
    // Leer el archivo JSON
    const filePath = path.join(__dirname, 'src', 'data', 'mock-restaurant.json');
    console.log('📁 Leyendo archivo:', filePath);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log('✅ Archivo leído correctamente');
    
    // Transformar cada producto que tenga features
    if (data.categories) {
      data.categories.forEach(category => {
        if (category.products) {
          category.products.forEach(product => {
            if (product.features && Array.isArray(product.features)) {
              product.features = transformFeatures(product.features);
            }
          });
        }
      });
    }
    
    // Crear backup del archivo original
    const backupPath = path.join(__dirname, 'src', 'data', 'mock-restaurant-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
    console.log('✅ Backup creado en:', backupPath);
    
    // Escribir el archivo transformado
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('✅ Archivo transformado exitosamente');
    
    // Mostrar estadísticas
    let totalFeatures = 0;
    data.categories.forEach(category => {
      if (category.products) {
        category.products.forEach(product => {
          if (product.features) {
            totalFeatures += product.features.length;
          }
        });
      }
    });
    
    console.log(`📊 Total de features transformadas: ${totalFeatures}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar la transformación
transformRestaurantData();
