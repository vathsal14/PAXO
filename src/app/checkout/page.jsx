"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  ArrowLeft,
  Check,
  CreditCard,
  Truck,
} from "lucide-react";
import {
  getCart,
  clearCart,
  getCartTotal,
  getCartItemCount,
} from "@/utils/cart";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    restaurant_name: "",
    contact_person: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cartItems = getCart();
    setCart(cartItems);
    setCartItemCount(getCartItemCount());
    setLoading(false);

    // Redirect to cart if empty
    if (cartItems.length === 0) {
      window.location.href = "/cart";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!customerInfo.restaurant_name.trim()) {
      newErrors.restaurant_name = "Restaurant name is required";
    }

    if (!customerInfo.contact_person.trim()) {
      newErrors.contact_person = "Contact person name is required";
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_name: customerInfo.restaurant_name,
          contact_person: customerInfo.contact_person,
          email: customerInfo.email,
          phone: customerInfo.phone,
          items: cart,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send enquiry");
      }

      const result = await response.json();
      clearCart();
      alert("Enquiry sent successfully. Thank you!");
    } catch (error) {
      console.error("Error sending enquiry:", error);
      alert("Failed to send enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
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
                  className="h-12 w-auto"
                />
                <span className="text-red-600 font-bold text-xl">PAXO</span>
              </a>
            </div>
          </div>
        </header>

        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
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

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm">
            <a href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <a href="/cart" className="text-gray-500 hover:text-gray-700">
              Cart
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  Customer Information
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Restaurant Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Restaurant Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="restaurant_name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Restaurant/Business Name *
                      </label>
                      <input
                        type="text"
                        id="restaurant_name"
                        value={customerInfo.restaurant_name}
                        onChange={(e) =>
                          handleInputChange("restaurant_name", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-red-500 focus:border-red-500 ${errors.restaurant_name ? "border-red-500" : "border-gray-300"}`}
                        placeholder="e.g. Mario's Pizzeria"
                      />
                      {errors.restaurant_name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.restaurant_name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact_person"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        id="contact_person"
                        value={customerInfo.contact_person}
                        onChange={(e) =>
                          handleInputChange("contact_person", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-red-500 focus:border-red-500 ${errors.contact_person ? "border-red-500" : "border-gray-300"}`}
                        placeholder="e.g. John Smith"
                      />
                      {errors.contact_person && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.contact_person}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-red-500 focus:border-red-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                        placeholder="john@restaurant.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-red-500 focus:border-red-500 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                

                
              </div>
            </div>

            {/* Back to Cart Button */}
            <div className="mt-6">
              <a
                href="/cart"
                className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Cart
              </a>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-24">
              <div className="px-6 py-4 border-b">
                 <h3 className="text-lg font-bold text-gray-900">
                  Order Items
                 </h3>
              </div>

              <div className="p-6">
                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.product_name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3">
                   <button
                     onClick={handlePlaceOrder}
                     disabled={submitting}
                     className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                    {submitting ? "Sending..." : "Send Enquiry"}
                   </button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
