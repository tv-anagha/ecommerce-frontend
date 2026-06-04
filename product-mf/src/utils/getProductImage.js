const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'%3E%3Crect fill='%23f3f3f3' width='320' height='320'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='system-ui' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

export function getProductImage(product) {
  return (
    product?.imageUrl ??
    product?.image ??
    product?.thumbnail ??
    PLACEHOLDER
  );
}
