const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatCurrency(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return formatter.format(num);
}
