import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { handleOrderSuccess } from '@/lib/payments/stripe';
import { redirect } from 'next/navigation';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    redirect('/');
  }

  const success = await handleOrderSuccess(sessionId);

  if (!success) {
    redirect('/checkout/error');
  }

  // Clear the cart in localStorage (this will run on the client)
  const clearCartScript = `
    <script>
      localStorage.removeItem('cart');
    </script>
  `;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: clearCartScript }} />
      </div>
    </div>
  );
}