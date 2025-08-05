import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

// Safe wrapper function that absolutely prevents AxiosError from escaping
const safeLogin = async (loginFn: any, credentials: { email: string; password: string }) => {
  try {
    console.log('Safe login wrapper called');
    const result = await loginFn(credentials);
    console.log('Safe login result:', result);
    return result || { success: false };
  } catch (error: any) {
    console.error('Error caught in safe login wrapper:', error);
    
    // Absolutely prevent any error from propagating
    if (error.name === 'AxiosError') {
      console.log('AxiosError intercepted in safe wrapper');
      // Return failure result instead of throwing
      return { success: false };
    }
    
    // For any other error, also return failure
    console.error('Non-Axios error in safe wrapper:', error.name, error.message);
    return { success: false };
  }
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    
    // Wrap everything in a try-catch with comprehensive error handling
    try {
      console.log('Login form submitted');
      
      // Call login with additional error protection
      let result;
      try {
        result = await login({ email, password });
        console.log('Login result:', result);
      } catch (loginError: any) {
        console.error('Login call error:', loginError);
        
        // If it's an AxiosError, show appropriate message and return early
        if (loginError.name === 'AxiosError') {
          console.log('AxiosError caught in login page, error should be handled in AuthContext');
          // Don't show additional error toast, AuthContext should handle it
          return;
        }
        
        // For non-Axios errors, show fallback
        toast.error('An unexpected error occurred. Please try again.');
        return;
      }
      
      if (result && result.success && result.role) {
        // Success - redirect based on role
        console.log('Login successful, redirecting to:', result.role);
        switch (result.role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'staff':
            router.push('/staff/dashboard');
            break;
          case 'user':
            router.push('/user/home');
            break;
          default:
            toast.error('Unknown role: ' + result.role);
        }
      } else {
        console.log('Login failed, result:', result);
        // If result.success is false, error toast is already shown in AuthContext
      }
    } catch (outerError: any) {
      console.error('Outer error in handleSubmit:', outerError);
      
      // Final fallback - this should never happen
      if (outerError.name !== 'AxiosError') {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring focus:outline-none focus:border-orange-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring focus:outline-none focus:border-orange-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-200 disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

