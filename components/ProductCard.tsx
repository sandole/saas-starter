import React from 'react';

interface ProductCardProps {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, description, price, imageUrl, onAddToCart }) => {
    return (
        <div className="product-card border rounded-lg shadow-md p-4">
            <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-md mb-4" />
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="flex justify-between items-center">
                <span className="text-xl font-bold">${price.toFixed(2)}</span>
                <button
                    onClick={onAddToCart}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;