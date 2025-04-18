import ShoppingCart from '@/components/ShoppingCart';
import { getUserCart } from '@/lib/payments/actions';

export default async function CartPage() {
  const serverCart = await getUserCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>
      <ShoppingCart initialServerCart={serverCart} />
    </div>
  );
}