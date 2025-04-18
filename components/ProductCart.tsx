'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/lib/db/schema';
import { addToCart } from '@/lib/payments/actions';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCart = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsAdding(true);
    
    try {
      // Add to server-side cart
      const formData = new FormData();
      formData.append('productId', product.id.toString());
      formData.append('quantity', quantity.toString());
      await addToCart(formData);
      
      // Also handle client-side cart for non-logged in users
      const cartItem = {
        id: Date.now(), // Use timestamp as temporary id
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        quantity,
        imageUrl: product.imageUrl || '/images/placeholder.jpg',
      };
      
      // Get existing cart from localStorage
      const existingCart = localStorage.getItem('cart');
      const cart = existingCart ? JSON.parse(existingCart) : [];
      
      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex(
        (item: any) => item.productId === product.id
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.push(cartItem);
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Show success message
      alert('Product added to cart!');
      
      // Redirect to cart
      router.refresh();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-3 aspect-h-4 w-full overflow-hidden bg-gray-200">
        <img
          src={product.imageUrl || '/images/placeholder.jpg'}
          alt={product.name}
          className="h-60 w-full object-cover object-center"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-3">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-semibold text-gray-900">${Number(product.price).toFixed(2)}</p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="rounded-full p-0 w-8 h-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-gray-700">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={incrementQuantity}
              className="rounded-full p-0 w-8 h-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <form onSubmit={handleAddToCart} className="mt-6">
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="quantity" value={quantity} />
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isAdding}
          >
            {isAdding ? (
              'Adding...'
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}