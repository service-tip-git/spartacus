export const cart = {
  cartDetails: {
    id: 'ID',
    proceedToCheckout: 'Proceed to Checkout',
    cartName: 'Cart #{{code}}',
  },
  cartItems: {
    id: 'ID',
    description: 'Description',
    item: 'Item',
    itemPrice: 'Item price',
    quantity: 'Qty',
    quantityTitle:
      'The quantity represents the total number of this item in your cart.',
    total: 'Total',
    cartTotal: 'Cart total ({{count}} item)',
    cartTotal_plural: 'Cart total ({{count}} items)',
  },
  orderCost: {
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal after discounts:',
    shipping: 'Shipping:',
    estimatedShipping: 'Estimated shipping:',
    discount: 'You saved:',
    salesTax: 'Sales Tax:',
    grossTax: 'The order total does not include tax of',
    grossIncludeTax: 'The order total includes tax of',
    total: 'Total:',
    toBeDetermined: 'TBD',
  },
  voucher: {
    coupon: 'Have a coupon?',
    coupon_plural: 'Coupon codes',
    apply: 'Apply',
    placeholder: 'Promo code',
    applyVoucherSuccess: '{{voucherCode}} has been applied.',
    removeVoucherSuccess: '{{voucherCode}} has been removed.',
    anchorLabel: 'Enter or remove your coupon code',
    vouchersApplied: 'Applied coupons',
    availableCoupons: 'Available coupons',
    availableCouponsLabel: 'You can add these coupons to this order.',
  },
  saveForLaterItems: {
    itemTotal: 'Saved for later ({{count}} item)',
    itemTotal_plural: 'Saved for later ({{count}} items)',
    cartTitle: 'Cart',
    saveForLater: 'Save For Later',
    moveToCart: 'Move To Cart',
    stock: 'Stock',
    forceInStock: 'In Stock',
  },
  wishlist: {
    empty: 'No products in your wish list yet',
  },
  validation: {
    cartEntriesChangeDuringCheckout:
      'During checkout availability of entries in your cart has changed. Please review your cart.',
    cartEntryRemoved:
      '{{name}} was removed from the cart due to being out of stock.',
    productOutOfStock:
      '{{name}} has been removed from the cart due to insufficient stock.',
    productQuantityLowStock:
      '{{name}} quantity has reduced to {{quantity}} due to insufficient stock.',
    inProgress: 'Cart validation is running',
  },
};
