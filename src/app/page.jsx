"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Truck,
  Shield,
  Clock,
  Star,
  Phone,
  Mail,
  MapPin,
  Leaf,
  Recycle,
  CheckCircle,
} from "lucide-react";
import { getCartItemCount } from "@/utils/cart";

export default function HomePage() {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // Initial cart count
    setCartItemCount(getCartItemCount());

    // Listen for cart updates
    const handleCartUpdate = () => {
      setCartItemCount(getCartItemCount());
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const testimonials = [
    { quote: "Fast delivery and sturdy packaging. Perfect for our biryani takeaways.", name: "Paradise Biryani", location: "Hyderabad, Telangana", rating: 5 },
    { quote: "Consistent quality and great eco options. Customers love the feel.", name: "Chutneys", location: "Film Nagar, Hyderabad", rating: 4 },
    { quote: "Bulk orders arrive on time, and the containers hold up really well.", name: "Bawarchi Restaurant", location: "RTC X Roads, Hyderabad", rating: 5 },
    { quote: "Reliable supplies and quick support. Zero hassles during rush hours.", name: "Shah Ghouse", location: "Toli Chowki, Hyderabad", rating: 4 },
    { quote: "Excellent lids and cups. Our beverages stay spill‑free in transit.", name: "Café Niloufer", location: "Lakdikapul, Hyderabad", rating: 5 },
    { quote: "Premium boxes at fair prices. Repeat orders are straightforward.", name: "Pista House", location: "Charminar, Hyderabad", rating: 5 },
    { quote: "Great range from eco to classic. One stop for all disposables.", name: "Karachi Bakery Café", location: "Banjara Hills, Hyderabad", rating: 4 },
    { quote: "Bulk supply without delays. Packaging looks neat for dine‑out kits.", name: "Minerva Coffee Shop", location: "Somajiguda, Hyderabad", rating: 5 },
    { quote: "Durable cutlery and plates. Very satisfied with the consistency.", name: "Santosh Dhaba", location: "Abids, Hyderabad", rating: 4 },
    { quote: "Good value and responsive team. Makes operations much smoother.", name: "Abids Delight", location: "Abids, Hyderabad", rating: 5 },
  ];


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3">
              <img
                src="/src/__create/favicon.png"
                alt="Paxo Logo"
                className="h-14 w-auto"
              />
              <span className="text-red-600 font-bold text-xl">PAXO</span>
            </a>

            {/* Navigation */}
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
                href="#contact"
                className="text-gray-900 hover:text-red-600 font-medium transition-colors"
              >
                Contact
              </a>
            </nav>

            {/* Cart */}
            <a
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
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

      {/* Hero Section */}
      <section className="relative bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Premium Disposables & Cutlery for Restaurants
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Quality products delivered fast to your business. Choose from
                our extensive range of eco-friendly and traditional disposable
                solutions.
              </p>
              <a
                href="/products"
                className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg"
              >
                Browse Products
              </a>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop"
                alt="Restaurant disposables"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Business Description */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">About Paxo</h2>
          <div className="space-y-6 text-lg text-gray-600">
            <p>
              Paxo is your trusted partner in supplying high-quality disposables
              and cutlery solutions for restaurants, cafes, and food service
              businesses. We understand the demands of the food industry and
              provide products that meet your operational needs while
              maintaining the highest standards of quality.
            </p>
            <p>
              Our extensive product range includes both eco-friendly
              alternatives and traditional plastic materials, giving you the
              flexibility to choose solutions that align with your business
              values and customer preferences. From biodegradable containers to
              durable plastic cutlery, we have everything you need to serve your
              customers efficiently.
            </p>
            <p>
              What sets Paxo apart is our commitment to reliability, competitive
              pricing, and exceptional customer service. We work closely with
              restaurants of all sizes to ensure timely deliveries, bulk pricing
              options, and consistent product availability so you can focus on
              what you do best – serving great food.
            </p>
          </div>
        </div>
      </section>

      {/* Product Range Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Our Product Range
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Eco-Friendly Products */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-green-600 mb-4">
                <Leaf size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Eco-Friendly Products
              </h3>
              <p className="text-gray-600 mb-6">
                Sustainable disposable solutions made from biodegradable
                materials like sugarcane fiber, bamboo, and recycled paper.
                Perfect for environmentally conscious restaurants.
              </p>
              <a
                href="/products#biodegradable"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Explore Eco-Friendly
              </a>
            </div>

            {/* Plastic Materials */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-red-600 mb-4">
                <Recycle size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Plastic Materials
              </h3>
              <p className="text-gray-600 mb-6">
                Durable and cost-effective plastic disposables that offer
                reliability and functionality. Ideal for high-volume operations
                and events requiring sturdy products.
              </p>
              <a
                href="/products#plastic"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Explore Plastic Materials
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Claims Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Why Choose Paxo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Truck className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Quick and reliable delivery to keep your business running
                smoothly.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Bulk Pricing Available
              </h3>
              <p className="text-gray-600">
                Competitive bulk pricing options to help reduce your operational
                costs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Shield className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-gray-600">
                All products meet industry standards with consistent quality
                assurance.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Clock className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Restaurant Trusted
              </h3>
              <p className="text-gray-600">
                Trusted by restaurants nationwide for reliable supply solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            What Our Clients Say
          </h2>
          <div className="marquee-container">
            <div className="marquee flex gap-6">
              {[...testimonials, ...testimonials].map((t, idx) => (
                <div key={idx} className="bg-white rounded-lg p-6 shadow-lg w-80 flex-shrink-0">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={i < (t.rating || 5) ? "text-yellow-400" : "text-gray-300"}
                        size={20}
                        fill={i < (t.rating || 5) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">“{t.quote}”</p>
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-gray-500 text-sm">{t.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Details */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Get In Touch
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <img
                src="/src/__create/Capture.png"
                alt="Get in touch"
                className="max-w-full h-auto rounded-lg shadow-sm"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Phone className="text-red-600 mt-1" size={24} />
                  <div>
                    <div className="font-medium text-gray-900">Phone</div>
                    <a
                      href="tel:+1-800-PAXO-SUPPLY"
                      className="text-red-600 hover:text-red-700"
                    >
                      +91 93478 80924
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="text-red-600 mt-1" size={24} />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <a
                      href="mailto:orders@paxosupply.com"
                      className="text-red-600 hover:text-red-700"
                    >
                      orders@paxosupply.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="text-red-600 mt-1" size={24} />
                  <div>
                    <div className="font-medium text-gray-900">Address</div>
                    <div className="text-gray-600">
                      Manikonda
                      <br />
                      Hyderabad, Telangana
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}
