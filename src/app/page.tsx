'use client';

import Link from "next/link";
import { useMenuItems } from '@/hooks/useMenuItems';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import TestConnection from '@/components/TestConnection';

export default function HomePage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: menuItems, isLoading, error } = useMenuItems();

  // Get unique categories from menu items
  const categories = menuItems ? [...new Set(menuItems.map(item => item.category).filter(Boolean))] : [];
  
  // Filter menu items based on selected category
  const filteredMenuItems = selectedCategory 
    ? menuItems?.filter(item => item.category === selectedCategory)
    : menuItems;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative h-96 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to La Bella Vita</h1>
            <p className="text-lg md:text-xl mb-6">Savor the finest Italian cuisine in town</p>
            <Link
              href="#menu"
              className="inline-block px-6 py-3 bg-white text-amber-600 rounded-lg hover:bg-gray-100 font-semibold"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Debug Section - Remove this after fixing connection */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <TestConnection />
        </div>
      </section>

      {/* QR Code Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Quick Order with QR Code</h2>
          <p className="text-lg text-gray-600 mb-8">Scan the QR code to view our menu and place your order instantly!</p>
          <div className="max-w-md mx-auto bg-white p-8 shadow-lg rounded-lg">
            <div className="w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center rounded-lg mb-4">
              <span className="text-gray-500">QR Code Placeholder</span>
            </div>
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              Scan QR Code
            </button>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Menu</h2>
        
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === null
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 capitalize ${
                  selectedCategory === category
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            <span className="ml-3 text-gray-600">Loading menu items...</span>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">Failed to load menu items</p>
            <p className="text-red-500 text-sm mt-1">Please try refreshing the page</p>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && !error && filteredMenuItems?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No menu items found</p>
            {selectedCategory && (
              <p className="text-gray-500 text-sm mt-2">
                Try selecting a different category or view all items
              </p>
            )}
          </div>
        )}
        
        {/* Menu Items Grid */}
        {!isLoading && !error && filteredMenuItems && filteredMenuItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((item) => (
            <div key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center">
                <img src={item.image || "placeholder.jpg"} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-600 mt-1">${item.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-sm font-medium ${item.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {item.isAvailable ? '✓ Available' : '✗ Out of Stock'}
                  </span>
                  {item.category && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  )}
                </div>
                <button 
                  className={`mt-4 w-full px-4 py-2 rounded font-semibold transition-colors duration-200 ${
                    item.isAvailable 
                      ? 'bg-amber-500 text-white hover:bg-amber-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!item.isAvailable}
                >
                  {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                </button>
                {user && (user.role === 'ADMIN' || user.role === 'STAFF' || user.role === 'admin' || user.role === 'staff') && (
                  <div className="mt-2 text-xs text-gray-500">
                    ID: {item._id}
                  </div>
                )}
              </div>
            </div>
            ))}
          </div>
        )}
      </section>

      {/* Staff Management Section */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">Staff Management</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Order Management</h3>
              <p className="text-gray-600 mb-4">Track and manage incoming orders efficiently</p>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                View Orders
              </button>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Staff Dashboard</h3>
              <p className="text-gray-600 mb-4">Access staff schedules and notifications</p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Staff Login
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
