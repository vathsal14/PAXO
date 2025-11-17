"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { getCartItemCount, addToCart } from "@/utils/cart";

export default function CategoryPage({ params }) {
  const slug = params?.slug;

  const [cartItemCount, setCartItemCount] = useState(0);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [quantities, setQuantities] = useState({});

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

  useEffect(() => {
    if (slug) {
      fetchCategoryAndProducts();
    }
  }, [slug, searchTerm, sortBy, sortOrder]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);

      // Fetch category info
      const categoryResponse = await fetch("/api/categories");
      if (!categoryResponse.ok) {
        throw new Error("Failed to fetch categories");
      }
      const categoryData = await categoryResponse.json();
      const foundCategory = categoryData.categories.find(
        (cat) => cat.slug === slug,
      );

      if (!foundCategory) {
        throw new Error("Category not found");
      }

      setCategory(foundCategory);

      // Fetch products in this category
      const productsUrl = new URL("/api/products", window.location.origin);
      productsUrl.searchParams.set("category_id", foundCategory.id);
      if (searchTerm) productsUrl.searchParams.set("search", searchTerm);
      if (sortBy) productsUrl.searchParams.set("sort_by", sortBy);
      if (sortOrder) productsUrl.searchParams.set("sort_order", sortOrder);

      const productsResponse = await fetch(productsUrl);
      if (!productsResponse.ok) {
        throw new Error("Failed to fetch products");
      }
      const productsData = await productsResponse.json();
      setProducts(productsData.products || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, change) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change),
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);

    // Reset quantity after adding to cart
    setQuantities((prev) => ({
      ...prev,
      [product.id]: 1,
    }));

    // Show success message (you could use a toast library here)
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

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
              onClick={fetchCategoryAndProducts}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categoryColor =
    category?.parent_category === "eco-friendly" ? "green" : "red";

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

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm">
            <a href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <a href="/products" className="text-gray-500 hover:text-gray-700">
              Products
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{category?.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {category?.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {category?.description}
            </p>
            <div
              className={`inline-flex items-center mt-4 px-4 py-2 rounded-full bg-${categoryColor}-100 text-${categoryColor}-600 text-sm font-medium`}
            >
              {category?.parent_category === "eco-friendly"
                ? "Eco-Friendly"
                : "Plastic Material"}
            </div>
          </div>

          {/* Search and Sort Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
              <Search
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="created_at">Sort by Newest</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")
                }
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title={`Sort ${sortOrder === "ASC" ? "Descending" : "Ascending"}`}
              >
                <ArrowUpDown size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={
                        product.image_url ||
                        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>

                    {product.sku && (
                      <p className="text-sm text-gray-500 mb-2">
                        SKU: {product.sku}
                      </p>
                    )}

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-gray-500">
                          per {product.unit}{" "}
                          {product.pack_quantity > 1 &&
                            `(Pack of ${product.pack_quantity})`}
                        </span>
                      </div>

                      {product.bulk_pricing && (
                        <div className="text-xs text-gray-500">
                          Bulk pricing available
                        </div>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(product.id, -1)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          disabled={quantities[product.id] <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {quantities[product.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(product.id, 1)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`w-full bg-${categoryColor}-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-${categoryColor}-700 transition-colors flex items-center justify-center space-x-2`}
                    >
                      <ShoppingCart size={16} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? `No products found for "${searchTerm}"`
                  : "No products available in this category"}
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
          )}
        </div>
      </div>

      
    </div>
  );
}
