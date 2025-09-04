'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { createMenuItem, uploadFile } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { MenuItem, MenuItemFormData } from '@/types';

export default function CreateMenuItem() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'appetizer',
    images: [] as string[],
    available: true,
  });

  const categories = [
    { value: 'appetizer', label: '🥗 Appetizer' },
    { value: 'main', label: '🍽️ Main Course' },
    { value: 'dessert', label: '🍰 Dessert' },
    { value: 'beverage', label: '🥤 Beverage' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const uploadedImageIds = await Promise.all(
        imageFiles.map(async (file) => {
          const response = await uploadFile(file);
          return response.data._id;
        })
      );

      const submitData : MenuItem = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: uploadedImageIds,
        available: formData.available,
      };

      await createMenuItem(submitData);
      toast.success('Menu item created successfully!');
      router.push('/admin/menu-items');

    } catch (error: unknown) {
      console.error('Error creating menu item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create menu item';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Please select image files');
      return;
    }

    setImageFiles(prev => [...prev, ...imageFiles]);

    const uploadPromises = imageFiles.map(file => {
      const reader = new FileReader();
      return new Promise<string>((resolve, reject) => {
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as string);
          } else {
            reject('Failed to read file');
          }
        };
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64images = await Promise.all(uploadPromises);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...base64images] }));
      toast.success('Images uploaded successfully!');
    } catch {
      toast.error('Error uploading images');
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/menu-items"
              className="text-orange-600 hover:text-orange-700 mb-4 inline-flex items-center"
            >
              ← Back to Menu Items
            </Link>
            <h1 className="text-3xl font-bold text-orange-800 mt-4">Create New Menu Item</h1>
            <p className="text-gray-600 mt-2">Add a new delicious item to your menu</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="e.g., Margherita Pizza"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                rows={3}
                placeholder="Describe this delicious item..."
              />
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* images Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item images
              </label>

              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragOver
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-400'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {formData.images.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Preview ${index}`}
                            className="w-full h-24 object-cover rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <label
                        htmlFor="image-upload"
                        className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition cursor-pointer"
                      >
                        Add More
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-6xl text-gray-400">📸</div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your images here
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        or click to browse files
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="mb-8">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Available for ordering
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Menu Item'}
              </button>
              <Link
                href="/admin/menu-items"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}