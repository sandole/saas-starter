'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart as CartIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createCheckoutAction } from '@/lib/payments/actions';

type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

export default function ShoppingCart({
  initialServerCart = [],
}: {
  initialServerCart?: CartItem[];
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialServerCart);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // If there's no server cart (user not logged in), load from localStorage
  useEffect(() => {
    if (initialServerCart.length === 0) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, [initialServerCart]);

  // Save cart to localStorage whenever it changes (for guest users)
  useEffect(() => {
    if (initialServerCart.length === 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, initialServerCart]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      await createCheckoutAction(cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })));
    } catch (error) {
      console.error('Checkout error:', error);
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[300px] bg-white rounded-lg shadow-sm">
        <CartIcon className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-4">Add some items to get started</p>
        <Button onClick={() => router.push('/')} className="bg-orange-500 hover:bg-orange-600">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-medium mb-6">Shopping Cart</h2>
      
      <div className="divide-y">
        {cartItems.map((item) => (
          <div key={item.id} className="py-4 flex items-center">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src={item.imageUrl || '/images/placeholder.jpg'}
                alt={item.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            
            <div className="ml-4 flex-1">
              <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
              <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <span className="mx-2 text-gray-700">{item.quantity}</span>
              
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="ml-4 text-right">
              <p className="text-base font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              
              <button
                onClick={() => removeItem(item.id)}
                className="mt-1 text-sm text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
          <p>Subtotal</p>
          <p>${calculateTotal().toFixed(2)}</p>
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md"
          >
            {isLoading ? 'Processing...' : 'Checkout'}
          </Button>
        </div>
      </div>
    </div>
  );
}