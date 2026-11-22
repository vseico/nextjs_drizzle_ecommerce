import CheckoutPageComponent from "@/components/checkout/CheckoutPageComponent";
import FrontedLayouts from "@/components/layouts/FrontedLayouts";
import { getMyAddresses } from "@/server-actions/address/address";

export const metadata = { title: "Checkout | Grocery Cart" };

export default async function CheckoutPage() {
  const addresses = await getMyAddresses();
  return (
    <FrontedLayouts>
      <CheckoutPageComponent
        initialAddresses={addresses}
        stripeEnabled={Boolean(process.env.STRIPE_SECRET_KEY)}
      />
    </FrontedLayouts>
  );
}
