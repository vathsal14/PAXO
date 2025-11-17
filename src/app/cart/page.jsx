"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
  getCartItemCount,
} from "@/utils/cart";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();

    // Listen for cart updates
    const handleCartUpdate = (event) => {
      setCart(event.detail);
      setCartItemCount(getCartItemCount());
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const loadCart = () => {
    const cartItems = getCart();
    setCart(cartItems);
    setCartItemCount(getCartItemCount());
    setLoading(false);
  };

  const handleQuantityUpdate = (productId, quantity) => {
    updateCartItemQuantity(productId, quantity);
    loadCart();
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    loadCart();
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
      loadCart();
    }
  };

  const subtotal = 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <a href="/" className="flex items-center space-x-3">
                <img
                  src="/src/__create/favicon.png"
                  alt="Paxo Logo"
                  className="h-14 w-auto"
                />
                <span className="text-red-600 font-bold text-xl">PAXO</span>
              </a>

              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="/"
                  className="text-gray-900 hover:text-red-600 font-medium transition-colors"
                >
                  Home
                </a>
                <a
                  href="/products"
                  className="text-gray-900 hover:text-red-600 font-medium transition-colors"
                >
                  Products
                </a>
                
                <a
                  href="/#contact"
                  className="text-gray-900 hover:text-red-600 font-medium transition-colors"
                >
                  Contact
                </a>
              </nav>

              <a href="/cart" className="relative p-2 text-red-600">
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </a>
            </div>
          </div>
        </header>

        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-3">
              <img
                src="/src/__create/favicon.png"
                alt="Paxo Logo"
                className="h-14 w-auto"
              />
              <span className="text-red-600 font-bold text-xl">PAXO</span>
            </a>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-gray-900 hover:text-red-600 font-medium transition-colors"
              >
                Home
              </a>
              <a
                href="/products"
                className="text-gray-900 hover:text-red-600 font-medium transition-colors"
              >
                Products
              </a>
              
              <a
                href="/#contact"
                className="text-gray-900 hover:text-red-600 font-medium transition-colors"
              >
                Contact
              </a>
            </nav>

            <a href="/cart" className="relative p-2 text-red-600">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </a>
          </div>
        </div>
      </header>

      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cart.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16">
            <div className="mb-6">
              <ShoppingCart size={64} className="mx-auto text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some products to get started!
            </p>
            <a
              href="/products"
              className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Continue Shopping
            </a>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Shopping Cart ({cart.length} items)
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={
                              item.image_url ||
                              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80"
                            }
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.product_name}
                          </h3>

                          {item.sku && (
                            <p className="text-sm text-gray-500 mt-1">
                              SKU: {item.sku}
                            </p>
                          )}

                          <div className="mt-2 text-sm text-gray-600">
                            <span>
                              {item.unit ? `${item.unit}` : ''}
                              {item.pack_quantity > 1 &&
                                ` (Pack of ${item.pack_quantity})`}
                            </span>
                          </div>

                          {/* Mobile quantity and remove */}
                          <div className="mt-4 sm:hidden flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.id,
                                    item.quantity - 1,
                                  )
                                }
                                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.id,
                                    item.quantity + 1,
                                  )
                                }
                                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Desktop quantity and price */}
                        <div className="hidden sm:flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleQuantityUpdate(item.id, item.quantity - 1)
                              }
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityUpdate(item.id, item.quantity + 1)
                              }
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping Button */}
              <div className="mt-6">
                <a
                  href="/products"
                  className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Continue Shopping
                </a>
              </div>
            </div>

            {/* Proceed Button */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border sticky top-24 p-6">
                <a href="/checkout" className="w-full inline-block bg-red-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Proceed
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
}
