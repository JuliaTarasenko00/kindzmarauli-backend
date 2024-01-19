const dishPricing = dish => {
  if (!dish) return;

  const discount = dish.discounted ? Number(dish.discounted) : 0;
  const discountAmount = (dish.price * discount) / 100;
  const finalPrice = Math.floor(dish.price - discountAmount);

  return { finalPrice };
};

export default dishPricing;
