import type { Metadata } from "next";
import { ShwapnoCheckout } from "@/components/sites/shwapno/shwapno-checkout";

export const metadata: Metadata = {
  title: "Checkout | Shwapno Online Grocery Shopping",
};

export default function CheckoutPage() {
  return <ShwapnoCheckout />;
}
