'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useState } from 'react';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { user, logout } = useAuth();
  const { data: menuItems } = useMenuItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get unique categories from menu items
  const categories = menuItems ? [...new Set(menuItems.map(item => item.category).filter(Boolean))] : [];

  const scrollToMenu = (category?: string) => {
    const element = document.getElementById('menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // If category is provided, you could implement category filtering here
    }
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold hover:text-orange-200 transition-colors duration-200">
            🍽️ La Bella Vita
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="hover:text-orange-200 transition-colors duration-200 font-medium">
              Home
            </Link>
            
            {/* Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 hover:text-orange-200 transition-colors duration-200 font-medium"
              >
                <span>Our Menu</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      scrollToMenu();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-50 transition-colors duration-200"
                  >
                    View All Items
                  </button>
                  
                  {categories.length > 0 && (
                    <>
                      <hr className="my-2" />
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Categories
                      </div>
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            scrollToMenu(category);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-50 transition-colors duration-200 capitalize"
                        >
                          {category}
                        </button>
                      ))}
                    </>
                  )}
                  
                  {menuItems && menuItems.length > 0 && (
                    <>
                      <hr className="my-2" />
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Popular Items
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {menuItems.slice(0, 6).map((item) => (
                          <button
                            key={item._id}
                            onClick={() => {
                              scrollToMenu();
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-50 transition-colors duration-200"
                          >
                            <div className="flex justify-between items-center">
                              <span className="truncate">{item.name}</span>
                              <span className="text-orange-600 font-semibold ml-2">${item.price.toFixed(2)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link href="#about" className="hover:text-orange-200 transition-colors duration-200 font-medium">
              About
            </Link>
            
            {/* Auth Section */}
            {!user ? (
              <Link
                href="/login"
                className="bg-white text-orange-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-orange-200 font-medium">
                  Welcome, {user.name}
                </span>
                <span className="bg-orange-600 px-2 py-1 rounded-full text-xs font-semibold">
                  {user.role}
                </span>
                <Link
                  href={
                    (user.role === 'admin' || user.role === 'ADMIN') ? '/admin/dashboard' :
                    (user.role === 'staff' || user.role === 'STAFF') ? '/staff/dashboard' :
                    '/user/home'
                  }
                  className="hover:text-orange-200 transition-colors duration-200 font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-orange-400 pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="hover:text-orange-200 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <button
                onClick={() => {
                  scrollToMenu();
                  setIsMenuOpen(false);
                }}
                className="text-left hover:text-orange-200 transition-colors duration-200 font-medium"
              >
                Our Menu
              </button>
              
              <Link
                href="#about"
                className="hover:text-orange-200 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Mobile Auth Section */}
              {!user ? (
                <Link
                  href="/login"
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium w-fit"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <>
                  <div className="text-orange-200 font-medium">
                    Welcome, {user.name} ({user.role})
                  </div>
                  <Link
                    href={
                      (user.role === 'admin' || user.role === 'ADMIN') ? '/admin/dashboard' :
                      (user.role === 'staff' || user.role === 'STAFF') ? '/staff/dashboard' :
                      '/user/home'
                    }
                    className="hover:text-orange-200 transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium w-fit"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

