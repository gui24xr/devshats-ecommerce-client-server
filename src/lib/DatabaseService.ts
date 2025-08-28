import { connectToDatabase, client } from "./mongodb";

const DatabaseService = {
    templates: {
        get: async () => {
            const db = await connectToDatabase();
            
            // Agregación con $lookup para traer datos cruzados
            const templates = await db.collection('productstemplates').aggregate([
                {
                    $lookup: {
                        from: 'customizationsfeatures',           // Colección a unir
                        localField: 'customizationsFeatures',    // Campo en productstemplates
                        foreignField: '_id',                     // Campo en customizationsfeatures
                        as: 'featuresData'                       // Nombre del campo resultado
                    }
                },
                {
                    // Opcional: Remover el array de IDs y solo dejar los datos poblados
                    $project: {
                        templateName: 1,
                        featuresData: 1,
                        // customizationsFeatures: 0  // Opcional: ocultar los IDs
                    }
                }
            ]).toArray();
            
            return templates;
        },

        // Función adicional para obtener un template específico por ID
        getById: async (templateId: string) => {
            const db = await connectToDatabase();
            const { ObjectId } = require('mongodb');
            
            const template = await db.collection('productstemplates').aggregate([
                {
                    $match: { _id: new ObjectId(templateId) }
                },
                {
                    $lookup: {
                        from: 'customizationsfeatures',
                        localField: 'customizationsFeatures',
                        foreignField: '_id',
                        as: 'featuresData'
                    }
                }
            ]).toArray();
            
            return template[0] || null;
        },

        create: async (templateData: any) => {
            // Declarar db y colecciones DENTRO de la función
            const db = await connectToDatabase();
            const productsTemplatesCollection = db.collection('productstemplates');
            const customizationsFeaturesCollection = db.collection('customizationsfeatures');
            
            console.log('templateData en servicio base de datos create', templateData);
            
            const session = client.startSession(); // Sin await aquí
            
            try {
                await session.startTransaction();
                
                let featuresInsertedIds = [];
                
                // IMPORTANTE: Pasar { session } a cada operación
                for (const feature of templateData.customizationFeatures) {
                    const featureInserted = await customizationsFeaturesCollection.insertOne(
                        { feature }, 
                        { session } // ← Esto es clave!
                    );
                    featuresInsertedIds.push(featureInserted.insertedId);
                }
                
                const templateForInsertData = {
                    templateName: templateData.templateName,
                    customizationsFeatures: featuresInsertedIds
                };
                
                // IMPORTANTE: Pasar { session } también aquí
                const templateInserted = await productsTemplatesCollection.insertOne(
                    templateForInsertData, 
                    { session } // ← Esto también es clave!
                );
                
                await session.commitTransaction();
                
                return {
                    success: true,
                    message: 'Transacción completada exitosamente',
                    templateId: templateInserted.insertedId,
                    featuresIds: featuresInsertedIds
                };
                
            } catch (error) {
                console.log('error', error);
                await session.abortTransaction();
                throw error;
            } finally {
                await session.endSession(); // Siempre cerrar la sesión
            }
        }
    }
}

export default DatabaseService;