

interface customizationFeatureTypeCombo {
    id: string;
    name: string;
    description: string | null;
    type: "combo";
    emoji?: string;
    icon?: string;
    imgUrl?: string;
    constraints: {
        minTotal: number;
        maxTotal: number;
        minPerOption: number;
        maxPerOption: number;
        exactTotal: number;
        required: boolean;
    };
    options: [{
        id: string;
        name: string;
        description: string | null;
        priceModifier: number;
        available: boolean;
        minQuantity: number;
        maxQuantity: number;
        sortOrder?: number;
        category?: string;
        emoji?: string;
        icon?: string;
        imgUrl?: string | null; 
    }]
}


interface customizationFeatureTypeCheck {
    id: string;
    name: string;
    description: string | null;
    type: "check";
    emoji?: string;
    icon?: string;
    imgUrl?: string;
    constraints: {
        minSelection: number;
        maxSelection: number;
        required: boolean;
    };
    options: [{
        id: string;
        name: string;
        description: string | null;
        priceModifier: number;
        available: boolean;
        default: boolean;
        sortOrder?: number;
        category?: string;
        emoji?: string;
        icon?: string;
        imgUrl?: string | null; 
    }]
}


interface customizationFeatureTypeVariant {
    id: string;
    name: string;
    description: string | null;
    type: "check";
    emoji?: string;
    icon?: string;
    imgUrl?: string;
    constraints: {
       required: boolean;
       allowMultiple: boolean;
    hasDefault: boolean;
    };
    options: [{
        id: string;
        name: string;
        description: string | null;
        priceModifier: number;
        available: boolean;
        default: boolean;
        sortOrder?: number;
        category?: string;
        emoji?: string;
        icon?: string;
        imgUrl?: string | null; 
    }]
}

interface Product {
    id: string;
    name: string;
    description?: string;
    images?: [{ 
        url: string; 
        alt: string, 
        default: boolean 
    }];
  price: {
                basePrice: number | null,
                discount?: number,
                finalPrice: number
            };
    preparationTime?: number;
    categories?: [{
        id: string;
        name: string;
        slug: string;
        displayOrder: number;
    }];
    reviewsCount?: number;
    rating?: number;
    tags?: [string];
    prepTime?: {
        min: number;
        max: number;
    } | null;
    features?: [{
       isNew?: boolean,
       isPopular?: boolean,
    }] | null;
    templateVariant?: {
        name: string;
        label: string;
        options: [{
            id: string;
            name: string;
            label: string;
            price: {
                basePrice?: number | null,
                discount?: number,
                finalPrice: number
            };
            sku: string;
            prepTime: {
                min: number;
                max: number;
            };
            isDefault: boolean;
            isActive: boolean;
        }]
    };
    customizationFeaturesTemplate?:[]
}