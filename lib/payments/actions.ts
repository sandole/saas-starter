'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession } from './stripe';
import { getUser } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { carts, cartItems, products } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

type CartItemData = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

export async function createCheckoutAction(items: CartItemData[]) {
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in?redirect=/cart');
  }

  // Process the items and create a checkout session
  await createCheckoutSession({
    cartItems: items,
    userId: user.id,
  });
}

export async function addToCart(formData: FormData) {
  const user = await getUser();
  const productId = Number(formData.get('productId'));
  const quantity = Number(formData.get('quantity') || 1);
  
  if (!user) {
    // For non-logged in users, we'll rely on client-side cart
    // which is handled in the ShoppingCart component
    return { success: true };
  }

  try {
    // Find or create user's cart
    let [userCart] = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, user.id))
      .limit(1);

    if (!userCart) {
      [userCart] = await db
        .insert(carts)
        .values({ userId: user.id })
        .returning();
    }

    // Check if item already exists in cart
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, userCart.id),
          eq(cartItems.productId, productId)
        )
      )
      .limit(1);

    if (existingItem.length > 0) {
      // Update quantity
      await db
        .update(cartItems)
        .set({ quantity: existingItem[0].quantity + quantity })
        .where(eq(cartItems.id, existingItem[0].id));
    } else {
      // Add new item
      await db.insert(cartItems).values({
        cartId: userCart.id,
        productId,
        quantity,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { error: 'Failed to add item to cart' };
  }
}

export async function getUserCart() {
  const user = await getUser();
  
  if (!user) {
    return [];
  }

  try {
    const [userCart] = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, user.id))
      .limit(1);

    if (!userCart) {
      return [];
    }

    const items = await db
      .select({
        id: cartItems.id,
        productId: products.id,
        name: products.name,
        price: products.price,
        quantity: cartItems.quantity,
        imageUrl: products.imageUrl,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, userCart.id));

    return items;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
}