export const SHWAPNO_CHECKOUT_STORAGE_KEY = "shwapno-checkout-items";

export type ShwapnoCheckoutItem = {
  id: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
};
