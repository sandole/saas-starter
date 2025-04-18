'use client';

import Link from 'next/link';
import { use, Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CircleIcon, ShoppingCart, User, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/lib/auth';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';

function UserMenu() {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
    router.push('/');
  }

  if (!user) {
    return (
      <Button asChild variant="outline" className="rounded-full">
        <Link href="/sign-in">
          <User className="h-4 w-4 mr-2" />
          Sign In
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <User className="h-4 w-4 mr-2" />
          {user.name || user.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/orders" className="w-full">My Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account" className="w-full">Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center text-orange-500">
              <CircleIcon className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">John's Plant Pots</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium"
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="cart-count"></span>
            </Link>
            <Suspense fallback={<div className="h-9 w-20" />}>
              <UserMenu />
            </Suspense>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/"
            className="block text-gray-700 hover:text-orange-500 px-3 py-2 text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="block text-gray-700 hover:text-orange-500 px-3 py-2 text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className="block text-gray-700 hover:text-orange-500 px-3 py-2 text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Cart
          </Link>
          <div className="px-3 py-2">
            <Suspense fallback={<div className="h-9" />}>
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}