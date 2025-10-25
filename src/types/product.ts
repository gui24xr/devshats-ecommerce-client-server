// Category interface
export interface Category {
    id: string;
    name: string;
    displayOrder: number;
    slug: string;
    itemsCount?: number | null;
    label: string;
    emoji?: string;
}

// Price data structure usado en productos
export interface PriceData {
    basePrice?: number | null;
    discount?: number | null;
    finalPrice: number;
}
export interface customizationFeatureTypeCombo {
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
  options: [
    {
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
    }
  ];
}

export interface customizationFeatureTypeCheck {
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
  options: [
    {
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
    }
  ];
}

export interface customizationFeatureTypeVariant {
  id: string;
  name: string;
  description: string | null;
  type: "variant";
  emoji?: string;
  icon?: string;
  imgUrl?: string;
  constraints: {
    required: boolean;
    allowMultiple: boolean;
    hasDefault: boolean;
  };
  options: [
    {
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
    }
  ];
}

export interface ProductTypeBasic {
  id: string;
  type: 'BASIC_PRODUCT';
  name: string;
  description?: string;
  images?: [
    {
      url: string;
      alt: string;
      default: boolean;
    }
  ];
  price: {
    basePrice?: number | null;
    discount?: number;
    finalPrice: number;
  };
  categories: [
    {
      id: string;
      name: string;
      slug: string;
      displayOrder: number;
    }
  ];
  reviewsCount?: number;
  rating?: number;
  tags?: [string];
  prepTime?: {
    min: number;
    max: number;
  } | null;
  features?:{ 
    isNew?: boolean;
    isPopular?: boolean;
  };
  customizationFeaturesTemplate?: [];
}


export interface ProductTypeSingleVariant {
  id: string;
  type: 'SINGLE_VARIANT_PRODUCT';
  name: string;
  description?: string;
  images?: [
    {
      url: string;
      alt: string;
      default: boolean;
    }
  ];
  categories: [
    {
      id: string;
      name: string;
      slug: string;
      displayOrder: number;
    }
  ];
  reviewsCount?: number;
  rating?: number;
  tags?: [string];
  prepTime?: {
    min: number;
    max: number;
  } | null;
  features?:{ 
    isNew?: boolean;
    isPopular?: boolean;
  };
  templateVariant: {
    name: string;
    label: string;
    options: [
      {
        id: string;
        name: string;
        label: string;
        price: {
          basePrice?: number | null;
          discount?: number | null;
          finalPrice: number;
        };
        sku?: string;
        prepTime: {
          min: number;
          max: number;
        };
        isDefault: boolean;
        isActive: boolean;
      }
    ];
  }
  customizationFeaturesTemplate?: [];
}


export type Product = ProductTypeBasic | ProductTypeSingleVariant;


export interface GetProductsResponse {
  products: Product[];
  categories: Category[];
  stats: {
    totalProducts: number;
  };
}
