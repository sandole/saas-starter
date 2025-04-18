import { CircleIcon } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center text-orange-500">
              <CircleIcon className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">John's Plant Pots</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Premium quality plant pots for your indoor and outdoor garden spaces.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-base text-gray-600 hover:text-orange-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-base text-gray-600 hover:text-orange-500"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-base text-gray-600 hover:text-orange-500"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="text-base text-gray-600">
                Email: contact@johnsplantpots.com
              </li>
              <li className="text-base text-gray-600">
                Phone: (555) 123-4567
              </li>
              <li className="text-base text-gray-600">
                Address: 123 Garden Street, Plantville
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-500 text-center">
            &copy; {currentYear} John's Plant Pots. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}