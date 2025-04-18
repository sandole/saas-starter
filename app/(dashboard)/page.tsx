export default function HomePage() {
  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                John's Plant Pots
                <span className="block text-orange-500">Faster Than Ever</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Grow your next cute and premium garden with John's pots
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <a
                  href="https://vercel.com/templates/next.js/next-js-saas-starter"
                  target="_blank"
                >
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
        <h2 className="text-base font-semibold text-orange-500 tracking-wide uppercase">
          Selections
        </h2>
        <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Premium Pots Collection
        </p>
          </div>
          <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
        {[
          { name: 'Elegant Pot', image: '/assets/dummy-pot1.jpg' },
          { name: 'Modern Pot', image: '/assets/dummy-pot2.jpg' },
          { name: 'Classic Pot', image: '/assets/dummy-pot3.jpg' },
        ].map((pot, index) => (
          <div
            key={index}
            className="relative flex flex-col gap-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out"
          >
            <img
          src={pot.image}
          alt={pot.name}
          className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-lg font-medium text-gray-900">{pot.name}</h3>
            <p className="text-base text-gray-500">
          A premium pot designed to enhance your garden's beauty.
            </p>
          </div>
        ))}
          </div>
        </div>
      </section>
    </main>
  );
}
