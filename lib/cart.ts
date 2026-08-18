/** A single row in the shopping cart. Price always comes from the catalog. */
export interface CartLine {
  productSlug: string;
  quantity: number;
}
