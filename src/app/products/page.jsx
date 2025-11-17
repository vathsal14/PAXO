"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, Search } from "lucide-react";
import ProductCard from "./ProductCard";
import { getCartItemCount, addToCart } from "@/utils/cart";

export default function ProductsPage() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: '' });
  // Image mapping for product categories
  const productImages = {
    'Meal Trays': 'https://images.unsplash.com/photo-1616196334211-3c606441eb6f?w=400',
    'Plates': 'https://images.unsplash.com/photo-1556910639-70c67ebef5e0?w=400',
    'Cutlery': 'https://images.unsplash.com/photo-1581299329066-3b17d1a39a7e?w=400',
    'Containers': 'https://images.unsplash.com/photo-1563453392212-326d5e8540b2?w=400',
    'Cups': 'https://images.unsplash.com/photo-1567337710232-ea9b56f1e2c6?w=400',
    'Tea Cups': 'https://images.unsplash.com/photo-1567337710232-ea9b56f1e2c6?w=400',
    'Straws': 'https://images.unsplash.com/photo-1601593764920-9bcaa6a7af53?w=400',
    'Bowls': 'https://images.unsplash.com/photo-1581299329066-3b17d1a39a7e?w=400',
    'Bags': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'
  };

  const [plasticProducts] = useState([
    // CATALOGUE A – PLASTIC & REGULAR PRODUCTS
    // SECTION 1: Meal Trays (CP Trays)
    {
      id: 'meal-trays',
      name: 'Meal Tray',
      section: 'Meal Trays',
      variants: [
        { id: 'cp-2', name: '2CP', sku: 'CP-2', unit: 'pack', pack_quantity: 25 },
        { id: 'cp-3', name: '3CP', sku: 'CP-3', unit: 'pack', pack_quantity: 25 },
        { id: 'cp-4', name: '4CP', sku: 'CP-4', unit: 'pack', pack_quantity: 25 },
        { id: 'cp-5', name: '5CP', sku: 'CP-5', unit: 'pack', pack_quantity: 25 },
        { id: 'cp-8', name: '8CP', sku: 'CP-8', unit: 'pack', pack_quantity: 25 },
      ]
    },
    
    // SECTION 2: Plates
    {
      id: 'plates',
      name: 'Plates',
      section: 'Plates',
      variants: [
        { id: 'plate-6', name: '6\"', sku: 'PL-6', unit: 'pack', pack_quantity: 100 },
        { id: 'plate-7', name: '7\"', sku: 'PL-7', unit: 'pack', pack_quantity: 100 },
        { id: 'plate-8', name: '8\"', sku: 'PL-8', unit: 'pack', pack_quantity: 100 },
        { id: 'plate-10', name: '10\"', sku: 'PL-10', unit: 'pack', pack_quantity: 50 },
        { id: 'plate-12', name: '12\"', sku: 'PL-12', unit: 'pack', pack_quantity: 25 },
      ]
    },
    
    // SECTION 5: Cutlery
    {
      id: 'spoons',
      name: 'Spoons',
      section: 'Cutlery',
      variants: [
        { id: 'spoon-sm', name: 'Small', sku: 'SP-SM', unit: 'pack', pack_quantity: 100 },
        { id: 'spoon-md', name: 'Medium', sku: 'SP-MD', unit: 'pack', pack_quantity: 100 },
      ]
    },
    {
      id: 'fork',
      name: 'Fork',
      section: 'Cutlery',
      variants: [
        { id: 'fork-std', name: 'Standard', sku: 'FK-STD', unit: 'pack', pack_quantity: 100 },
      ]
    },
    {
      id: 'stirrer',
      name: 'Stirrer',
      section: 'Cutlery',
      variants: [
        { id: 'stirrer-01', name: 'Standard', sku: 'ST-01', unit: 'pack', pack_quantity: 500 },
      ]
    },
    
    // SECTION 7: Containers
    {
      id: 'round-containers',
      name: 'Round Containers',
      section: 'Containers',
      variants: [
        { id: 'cont-rnd-sm', name: 'Small', sku: 'CT-RND-SM', unit: 'pack', pack_quantity: 50 },
        { id: 'cont-rnd-md', name: 'Medium', sku: 'CT-RND-MD', unit: 'pack', pack_quantity: 50 },
      ]
    },
    {
      id: 'square-container',
      name: 'Square Container',
      section: 'Containers',
      variants: [
        { id: 'cont-sq-sm', name: 'Small', sku: 'CT-SQ-SM', unit: 'pack', pack_quantity: 50 },
      ]
    },
    {
      id: 'rectangular-container',
      name: 'Rectangular Container',
      section: 'Containers',
      variants: [
        { id: 'cont-rec-sm', name: 'Standard', sku: 'CT-REC-SM', unit: 'pack', pack_quantity: 50 },
      ]
    },
    
    // SECTION 14: Cups
    {
      id: 'cups',
      name: 'Cups',
      section: 'Cups',
      variants: [
        { id: 'cup-100', name: '100ml', sku: 'CP-100', unit: 'pack', pack_quantity: 100 },
        { id: 'cup-200', name: '200ml', sku: 'CP-200', unit: 'pack', pack_quantity: 100 },
        { id: 'cup-300', name: '300ml', sku: 'CP-300', unit: 'pack', pack_quantity: 100 },
      ]
    },
    {
      id: 'sambar-cup',
      name: 'Sambar Cup',
      section: 'Cups',
      variants: [
        { id: 'cp-smb', name: 'Standard', sku: 'CP-SMB', unit: 'pack', pack_quantity: 100 },
      ]
    },
    {
      id: 'curry-cup',
      name: 'Curry Cup',
      section: 'Cups',
      variants: [
        { id: 'cp-cur', name: 'Standard', sku: 'CP-CUR', unit: 'pack', pack_quantity: 100 },
      ]
    },
    
    // SECTION 25: Tea Cups
    {
      id: 'tea-cups',
      name: 'Tea Cups',
      section: 'Tea Cups',
      variants: [
        { id: 'tea-cup-100', name: '100ml', sku: 'TC-100', unit: 'pack', pack_quantity: 50 },
        { id: 'tea-cup-150', name: '150ml', sku: 'TC-150', unit: 'pack', pack_quantity: 50 },
        { id: 'tea-cup-200', name: '200ml', sku: 'TC-200', unit: 'pack', pack_quantity: 50 },
      ]
    },
    
    // SECTION 32: Straws
    {
      id: 'straws',
      name: 'Straws',
      section: 'Straws',
      variants: [
        { id: 'straw-6', name: '6\"', sku: 'STR-6', unit: 'pack', pack_quantity: 500 },
        { id: 'straw-8', name: '8\"', sku: 'STR-8', unit: 'pack', pack_quantity: 500 },
      ]
    }
  ].map(product => ({
    ...product,
    catalog: 'Plastic & Regular Products',
    image_url: productImages[product.section] || 'https://images.unsplash.com/photo-1586075010924-7d5a18f9b6d1?w=400',
    description: product.description || `${product.name} - Available in multiple sizes`,
    variants: product.variants.map(variant => ({
      ...variant,
      full_name: `${product.name} ${variant.name}`.trim(),
      description: `${product.name} ${variant.name} - Pack of ${variant.pack_quantity}`.trim()
    }))
  })));

  const [biodegradableProducts] = useState([
    // CATALOGUE B – BIODEGRADABLE PRODUCTS
    {
      id: 'biodegradable-plates',
      name: 'Biodegradable Plates',
      section: 'Plates',
      variants: [
        { id: 'bioplate-6', name: '6\"', sku: 'BIO-PL-6', unit: 'pack', pack_quantity: 50 },
        { id: 'bioplate-8', name: '8\"', sku: 'BIO-PL-8', unit: 'pack', pack_quantity: 50 },
      ]
    },
    {
      id: 'biodegradable-meal-trays',
      name: 'Biodegradable Meal Trays',
      section: 'Meal Trays',
      variants: [
        { id: 'biomeal-2cp', name: '2CP', sku: 'BIO-CP-2', unit: 'pack', pack_quantity: 25 },
        { id: 'biomeal-3cp', name: '3CP', sku: 'BIO-CP-3', unit: 'pack', pack_quantity: 25 },
      ]
    },
    {
      id: 'biodegradable-containers',
      name: 'Biodegradable Containers',
      section: 'Containers',
      variants: [
        { id: 'biocont-sm', name: 'Small', sku: 'BIO-CT-SM', unit: 'pack', pack_quantity: 50 },
        { id: 'biocont-md', name: 'Medium', sku: 'BIO-CT-MD', unit: 'pack', pack_quantity: 50 },
      ]
    },
    {
      id: 'biodegradable-cups',
      name: 'Biodegradable Cups',
      section: 'Cups',
      variants: [
        { id: 'biocup-200', name: '200ml', sku: 'BIO-CP-200', unit: 'pack', pack_quantity: 100 },
      ]
    },
    {
      id: 'biodegradable-bowls',
      name: 'Biodegradable Bowls',
      section: 'Bowls',
      variants: [
        { id: 'biobowl-12oz', name: '12oz', sku: 'BIO-BL-12', unit: 'pack', pack_quantity: 50 },
      ]
    },
    {
      id: 'biodegradable-cutlery',
      name: 'Biodegradable Cutlery Set',
      section: 'Cutlery',
      variants: [
        { id: 'biocutlery-set', name: 'Standard', sku: 'BIO-CUT-SET', unit: 'pack', pack_quantity: 100 },
      ]
    },
    {
      id: 'biodegradable-bags',
      name: 'Biodegradable Bags',
      section: 'Bags',
      variants: [
        { id: 'biobag-sm', name: 'Small', sku: 'BIO-BG-SM', unit: 'pack', pack_quantity: 100 },
        { id: 'biobag-md', name: 'Medium', sku: 'BIO-BG-MD', unit: 'pack', pack_quantity: 100 },
        { id: 'biobag-lg', name: 'Large', sku: 'BIO-BG-LG', unit: 'pack', pack_quantity: 50 },
      ]
    },
    {
      id: 'biodegradable-straws',
      name: 'Biodegradable Straws',
      section: 'Straws',
      variants: [
        { id: 'biostraw', name: 'Standard', sku: 'BIO-STRW', unit: 'pack', pack_quantity: 500 },
      ]
    }
  ].map(product => ({
    ...product,
    catalog: 'Biodegradable Products',
    image_url: productImages[product.section] || 'https://images.unsplash.com/photo-1590845947680-5b6f76100493?w=400',
    description: product.description || `${product.name} - Available in multiple sizes`,
    variants: product.variants.map(variant => ({
      ...variant,
      full_name: `${product.name} ${variant.name}`.trim(),
      description: `${product.name} ${variant.name} - Pack of ${variant.pack_quantity}`.trim(),
      is_biodegradable: true
    }))
  })));
  
  // Combine all products for search and filtering
  const allProducts = [...plasticProducts, ...biodegradableProducts];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const [activeTab, setActiveTab] = useState('plastic');
  
  const filterProducts = (products) => {
    return products.filter((product) => {
      // Check if product name or any variant SKU matches the search term
      const productMatches = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const variantMatches = product.variants.some(variant => 
        variant.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return productMatches || variantMatches;
    });
  };

  const filteredPlasticProducts = filterProducts(plasticProducts);
  const filteredBiodegradableProducts = filterProducts(biodegradableProducts);
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash?.slice(1);
      if (hash === 'biodegradable' || hash === 'eco-friendly') {
        setActiveTab('biodegradable');
      } else if (hash === 'plastic' || hash === 'plastic-materials') {
        setActiveTab('plastic');
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const handleAddToCart = (product, variant = null) => {
    // If no variant is provided, use the first variant
    const selectedVariant = variant || (product.variants && product.variants[0]);
    
    if (!selectedVariant) {
      console.error('No variant available for this product');
      setToast({ show: true, message: 'Error: No variant selected' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return;
    }

    // Create a cart item with all required fields
    const cartItem = {
      id: selectedVariant.id,
      product_id: product.id, // Keep reference to the parent product
      product_name: selectedVariant.full_name || `${product.name} ${selectedVariant.name || ''}`.trim(),
      quantity: 1, // Default quantity
      unit_price: 0, // No price as per requirements
      subtotal: 0,  // No price as per requirements
      image_url: product.image_url,
      sku: selectedVariant.sku || '',
      unit: selectedVariant.unit || 'piece',
      pack_quantity: selectedVariant.pack_quantity || 1,
      variant_name: selectedVariant.name || '',
      // Include any additional product info that might be useful
      product: {
        ...product,
        variants: undefined // Remove the variants array to avoid circular references
      }
    };
    
    try {
      // Add to cart
      addToCart(cartItem, 1);
      
      // Show success toast
      setToast({ 
        show: true, 
        message: `${cartItem.product_name} added to cart`,
        type: 'success'
      });
      
      // Update cart count
      setCartItemCount(getCartItemCount());
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToast({ 
        show: true, 
        message: 'Failed to add item to cart',
        type: 'error'
      });
    }
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };
  
  // Update cart item count when cart changes
  useEffect(() => {
    setCartItemCount(getCartItemCount());
  }, [toast]); // This will run when the toast state changes, which happens after addToCart

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <a href="/" className="flex items-center space-x-3">
                <img
                  src="/src/__create/favicon.png"
                  alt="Paxo Logo"
                  className="h-16 w-16"
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

        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <a href="/" className="flex items-center space-x-3">
                <img
                  src="/src/__create/favicon.png"
                  alt="Paxo Logo"
                  className="h-16 w-16"
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

        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-lg" role="alert">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="ml-3 text-sm font-normal">{toast.message}</div>
          </div>
        </div>
      )}
      {/* Header */}
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

      

      {/* Anchors for deep links */}
      <div id="plastic" />
      <div id="biodegradable" />

      {/* Page Title and Search */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Products</h1>
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Search...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Catalog Tabs */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('plastic')}
                className={`${activeTab === 'plastic' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Plastic & Regular Products
              </button>
              <button
                onClick={() => setActiveTab('biodegradable')}
                className={`${activeTab === 'biodegradable' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Biodegradable Products
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'plastic' ? (
            filteredPlasticProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlasticProducts.map((product) => (
                  <ProductCard key={product.id} product={product} handleAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">
                  {searchTerm
                    ? `No products found for "${searchTerm}"`
                    : "No products available"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )
          ) : (
            filteredBiodegradableProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBiodegradableProducts.map((product) => (
                  <ProductCard key={product.id} product={product} handleAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-green-50 rounded-lg">
                <p className="text-gray-500 text-lg">
                  {searchTerm
                    ? `No products found for "${searchTerm}"`
                    : "No products available"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </div>

      
    </div>
  );
}
