export function enrichCartItems(items, products = []) {
  const byId = new Map(
    products.map((p) => [Number(p.id ?? p.productId), p]),
  );

  return items.map((item) => {
    const productId = Number(item.productId);
    const product = byId.get(productId);
    return {
      ...item,
      productId,
      name: product?.name ?? product?.title ?? `Product #${productId}`,
      price: product?.price ?? null,
      imageUrl:
        product?.imageUrl ?? product?.image_url ?? product?.image ?? null,
    };
  });
}
