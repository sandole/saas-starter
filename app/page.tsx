import { db } from '@/lib/db/drizzle';
import { products } from '@/lib/db/schema';
import ProductCard from '@/components/ProductCard';
import { CircleIcon } from 'lucide-react';

export default async function HomePage() {
  const productsList = await db.select().from(products);

  return (
    <main>
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
              John's Plant Pots
              <span className="block text-orange-500 mt-2">Premium Quality for Your Garden</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Beautiful, durable plant pots to enhance your indoor and outdoor spaces.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <CircleIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold text-gray-900">
              Featured Products
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Discover our collection of premium plant pots
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {productsList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}