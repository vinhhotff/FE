'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-orange-500 text-white shadow-lg py-4">
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-orange-200 transition">
          🍽️ Restaurant
        </Link>
        
        <ul className="flex space-x-6 items-center">
          <li>
            <Link href="/" className="hover:text-orange-200 transition font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link href="/menu" className="hover:text-orange-200 transition font-medium">
              Menu
            </Link>
          </li>
          
          {!user ? (
            <>
              <li>
                <Link href="/admin/login" className="hover:text-orange-200 transition font-medium">
                  Admin
                </Link>
              </li>
              <li>
                <Link href="/staff/login" className="hover:text-orange-200 transition font-medium">
                  Staff
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="text-orange-200">
                Welcome, {user.name} ({user.role})
              </li>
              <li>
                {user.role === 'admin' ? (
                  <Link href="/admin" className="hover:text-orange-200 transition font-medium">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/staff" className="hover:text-orange-200 transition font-medium">
                    Dashboard
                  </Link>
                )}
              </li>
              <li>
                <button 
                  onClick={logout}
                  className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded transition font-medium"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

