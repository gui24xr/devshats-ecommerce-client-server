import { Product, PriceData } from '../types';

const ProductsHelpers = {
  getInitialVariantId: (product: Product): string | null => {
    if (product.type === 'SINGLE_VARIANT_PRODUCT') {
      const selectedVariant = product?.templateVariant.options.find(
        (item) => item.isDefault === true
      );
      return selectedVariant?.id || null;
    }
    return null;
  },

  getProductPrice: (product: Product, selectedVariantId: string): PriceData | undefined => {
    if (product.type === 'SINGLE_VARIANT_PRODUCT') {

      let selectedVariant
      if (product.priceStrategy == 'TEMPLATE_VARIANT_PRICE'){
          selectedVariant = product?.templateVariant.options.find((item) => item.id === selectedVariantId);
          return selectedVariant?.price;
        }

       if (product.priceStrategy == 'UNIQUE_PRICE')
          return product?.price
    }
    

    if (product.type === 'BASIC_PRODUCT') return product?.price;

    throw new Error('Product type not supported');
  },

  
};



export default ProductsHelpers;