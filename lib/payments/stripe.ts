import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/drizzle';
import { orders, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function createCheckoutSession({
  cartItems,
  userId,
}: {
  cartItems: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  userId: number;
}) {
  if (cartItems.length === 0) {
    redirect('/cart');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/cart`,
    client_reference_id: userId.toString(),
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB'],
    },
  });

  // Create a pending order
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await db.insert(orders).values({
    userId: userId,
    total: total.toString(),
    stripeCheckoutId: session.id,
    status: 'pending',
  });

  redirect(session.url!);
}

export async function handleOrderSuccess(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    if (session.payment_status === 'paid') {
      // Update the order status in your database
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.stripeCheckoutId, sessionId))
        .limit(1);

      if (order) {
        await db
          .update(orders)
          .set({ status: 'paid' })
          .where(eq(orders.id, order.id));
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error handling order success:', error);
    return false;
  }
}

export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleOrderSuccess(session.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}