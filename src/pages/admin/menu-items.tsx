'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { fetchMenuItems, deleteMenuItem } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { MenuItem } from '@/types';

export default function AdminMenuItems() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'appetizer', label: '🥗 Appetizer' },
    { value: 'main', label: '🍽️ Main Course' },
    { value: 'dessert', label: '🍰 Dessert' },
    { value: 'beverage', label: '🥤 Beverage' },
  ];

  const availabilityOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'available', label: '✅ Available' },
    { value: 'unavailable', label: '❌ Unavailable' },
  ];

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        const data = await fetchMenuItems();
        setMenuItems(data);
      } catch (error) {
        console.error('Error loading menu items:', error);
        toast.error('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteMenuItem(id);
        setMenuItems(menuItems.filter(item => item._id !== id));
        toast.success('Menu item deleted successfully!');
      } catch (error) {
        console.error('Error deleting menu item:', error);
        toast.error('Failed to delete menu item');
      }
    }
  };

  const filteredAndSortedItems = menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesAvailability = availabilityFilter === 'all' || 
                                 (availabilityFilter === 'available' && item.isAvailable) ||
                                 (availabilityFilter === 'unavailable' && !item.isAvailable);
      
      return matchesSearch && matchesCategory && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        default:
          return 0;
      }
    });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'appetizer': return '🥗';
      case 'main': return '🍽️';
      case 'dessert': return '🍰';
      case 'beverage': return '🥤';
      default: return '🍽️';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'appetizer': return 'Appetizer';
      case 'main': return 'Main Course';
      case 'dessert': return 'Dessert';
      case 'beverage': return 'Beverage';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gradient-to-tr from-orange-500 to-amber-700 text-white shadow-lg py-6 px-4">
        <div className="text-2xl font-bold mb-8 tracking-wide flex items-center">
          <span className="mr-3">🍽️</span> Admin Panel
        </div>
        <div className="flex-1 space-y-2">
          <Link href="/admin/dashboard" className="block py-2 px-4 rounded hover:bg-orange-700 transition">
            Dashboard
          </Link>
          <Link href="/admin/menu-items" className="block py-2 px-4 rounded bg-orange-700 bg-opacity-60 font-semibold">
            Menu Items
          </Link>
          <Link href="/admin/orders" className="block py-2 px-4 rounded hover:bg-orange-700 transition">
            Orders
          </Link>
          <Link href="/admin/users" className="block py-2 px-4 rounded hover:bg-orange-700 transition">
            Users
          </Link>
          <Link href="/admin/revenue" className="block py-2 px-4 rounded hover:bg-orange-700 transition">
            Revenue
          </Link>
        </div>
        <hr className="my-4 border-amber-300" />
        <div className="text-sm text-orange-100 mt-auto">
          {user && (
            <>
              <div className="font-bold">{user.name}</div>
              <div className="text-xs">({user.email})</div>
              <div className="mt-1 text-orange-300">Role: {user.role}</div>
              <button
                onClick={() => logout()}
                className="mt-4 w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-semibold transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-orange-800">Menu Items</h1>
                <p className="text-gray-600 mt-2">Manage your restaurant's menu items</p>
              </div>
              <Link
                href="/admin/menu-items/create"
                className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                <span className="mr-2">+</span>
                Add New Item
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {menuItems.filter(item => item.isAvailable).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <span className="text-2xl">❌</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Unavailable</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {menuItems.filter(item => !item.isAvailable).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(menuItems.reduce((sum, item) => sum + item.price, 0) / Math.max(menuItems.length, 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or description..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  >
                    {availabilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price (Low to High)</option>
                    <option value="price-high">Price (High to Low)</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items Grid */}
          {filteredAndSortedItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No menu items found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
              <Link
                href="/admin/menu-items/create"
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                <span className="mr-2">+</span>
                Add Your First Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Image */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/files/${item.images[0]}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${item.images && item.images.length > 0 ? 'hidden' : ''}`}>
                      <span className="text-4xl text-gray-400">🍽️</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                        {item.name}
                      </h3>
                      <span className="text-xl font-bold text-orange-600 ml-2">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                                         <div className="flex items-center justify-between mb-4">
                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                         <span className="mr-1">{getCategoryIcon(item.category || '')}</span>
                         {getCategoryLabel(item.category || '')}
                       </span>
                       
                       {item.images && item.images.length > 0 && (
                         <span className="text-xs text-gray-500">
                           Has image
                         </span>
                       )}
                     </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/menu-items/${item._id}/edit`)}
                        className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, item.name)}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Count */}
          {filteredAndSortedItems.length > 0 && (
            <div className="mt-8 text-center text-gray-600">
              Showing {filteredAndSortedItems.length} of {menuItems.length} menu items
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

