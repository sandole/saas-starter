'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users, carts } from '@/lib/db/schema';
import { comparePasswords, hashPassword, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUser } from '@/lib/db/queries';

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
  redirect: z.string().optional(),
});

export async function signIn(formData: FormData) {
  const validation = signInSchema.safeParse(Object.fromEntries(formData));
  
  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
    };
  }

  const { email, password, redirect: redirectUrl } = validation.data;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length === 0) {
    return {
      error: 'Invalid email or password. Please try again.',
    };
  }

  const user = existingUser[0];
  const isPasswordValid = await comparePasswords(password, user.passwordHash);

  if (!isPasswordValid) {
    return {
      error: 'Invalid email or password. Please try again.',
    };
  }

  await setSession(user);

  if (redirectUrl) {
    return redirect(redirectUrl);
  }

  return redirect('/');
}

const signUpSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
  redirect: z.string().optional(),
});

export async function signUp(formData: FormData) {
  const validation = signUpSchema.safeParse(Object.fromEntries(formData));
  
  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
    };
  }

  const { email, password, redirect: redirectUrl } = validation.data;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      error: 'An account with this email already exists.',
    };
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
    })
    .returning();

  if (!user) {
    return {
      error: 'Failed to create account. Please try again.',
    };
  }

  // Create a cart for the new user
  await db.insert(carts).values({
    userId: user.id,
  });

  await setSession(user);

  if (redirectUrl) {
    return redirect(redirectUrl);
  }

  return redirect('/');
}

export async function signOut() {
  const user = await getUser();
  
  if (user) {
    (await cookies()).delete('session');
  }
  
  return redirect('/');
}