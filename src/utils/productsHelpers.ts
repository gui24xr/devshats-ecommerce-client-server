const ProductsHelpers = {
  getInitialVariantId: (product: any) => {
    if (product.templateVariant) {
      const selectedVariant = product?.templateVariant.options.find(
        (item) => item.isDefault == true
      );
      return selectedVariant?.id;
    }
    return null;
  },

  getProductPrice: (product: any, selectedVariantId: any) => {
    if (product?.templateVariant) {
      const selectedVariant = product?.templateVariant.options.find(
        (item) => item.id == selectedVariantId
      );
      return selectedVariant?.price;
    }
    return product?.price;
  },
};

export default ProductsHelpers;