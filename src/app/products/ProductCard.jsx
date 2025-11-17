import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product, handleAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  return (
    <div
      key={product.id}
      className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${product.catalog === 'Biodegradable Products' ? 'border border-green-100' : ''} flex flex-col h-full`}
    >
      <div className="h-40 bg-gray-100 flex items-center justify-center p-4">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-auto object-contain"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-medium text-gray-900">
          {product.name}
        </h3>
        {product.variants.length > 1 ? (
          <div className="mt-2 min-h-[72px]">
            <label htmlFor={`variant-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <select
              id={`variant-${product.id}`}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
              value={selectedVariant.id}
              onChange={(e) => {
                const variant = product.variants.find(v => v.id === e.target.value);
                setSelectedVariant(variant);
              }}
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.name} ({variant.pack_quantity} per pack)
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mt-2 min-h-[72px]" />
        )}

        

        <div className="mt-auto">
          <button
            onClick={() => handleAddToCart(product, selectedVariant)}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;