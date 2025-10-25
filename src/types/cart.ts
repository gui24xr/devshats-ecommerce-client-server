
export interface SelectedVariantOption {
  id: string;
  name: string;
  label: string;
  sku?: string;
  priceData: {
    basePrice?: number | null;
    discount?: number | null;
    finalPrice: number;
  };
}

export interface VariantForCart {
  name: string;
  label: string;
  selectedOption: SelectedVariantOption | null;
}

export interface SelectedCustomizationOption {
  id: string;
  name: string;
  description: string | null;
  priceModifier: number;
  available: boolean;
  sortOrder?: number;
  category?: string;
  emoji?: string;
  icon?: string;
  imgUrl?: string | null;
  isSelected: boolean;
  selectedQuantity?: number; // solo para combo
}

export interface CustomizationFeatureForCart {
  id: string;
  name: string;
  description: string | null;
  type: "combo" | "check" | "variant";
  emoji?: string;
  icon?: string;
  imgUrl?: string;
  constraints: any;
  selectedOptions: SelectedCustomizationOption[];
}

export interface ItemForCart {
  id: string;
  type: 'BASIC_PRODUCT' | 'SINGLE_VARIANT_PRODUCT';
  title: string;
  image?: string;
  variant: VariantForCart | null;
  customizationFeatures: CustomizationFeatureForCart[] | null;
  priceData: {
    basePrice: {
      basePrice?: number | null;
      discount?: number | null;
      finalPrice: number;
    } | null;
    extraForCustomizations: number;
    finalPrice: number;
  };
}



// Datos del producto en el carrito (sin priceData)
export interface CartItemProductData {
  id: string;
  type: 'BASIC_PRODUCT' | 'SINGLE_VARIANT_PRODUCT';
  title: string;
  image?: string;
  variant: VariantForCart | null;
  customizationFeatures: CustomizationFeatureForCart[] | null;
}

// Datos de precio unitario
export interface CartItemPriceData {
  basePrice: {
    basePrice?: number | null;
    discount?: number | null;
    finalPrice: number;
  } | null;
  extraForCustomizations: number;
  finalPrice: number;
}

// Item completo en el carrito
export interface CartItem {
  id: string; // ID único del item en el carrito
  productData: CartItemProductData;
  unitPriceData: CartItemPriceData;
  quantity: number;
  subtotal: number;
}

// Ticket del carrito
export interface CartTicket {
  detail: CartItem[];
  itemsCount: number;
  totalPrice: number;
}

// ========================================
// CART STORE STATE
// ========================================

export interface CartStoreState {
  items: CartItem[];
  itemsCount: number;
  totalPrice: number;
  error: string | null;

  // Public methods
  addToCart: ({ itemForCart, quantity }: { itemForCart: ItemForCart; quantity: number }) => void;
  changeCartItemQuantity: (itemId: string, newQuantity: number) => void;
  removeCartItem: (itemId: string) => void;
  clearCart: () => void;
  getCurrentCartTicket: () => CartTicket | undefined;
  clearError: () => void;

  // Private methods (prefijo _)
  _createCartItem: (newItemForCart: CartItem) => void;
  _updateCartItem: (itemId: string, updatedCartItem: CartItem) => void;
  _recalculateCart: () => void;
  _getCartItemById: (itemId: string) => CartItem | undefined;
  _getItemByProductData: (productData: CartItemProductData) => CartItem | undefined;
  _setError: (error: any) => void;
}