import Link from "next/link";

export default function HomePage() {
  // Sample menu items for demonstration
  const sampleMenuItems = [
    { id: 1, name: "Margherita Pizza", price: 18.99, description: "Fresh mozzarella, tomato sauce, basil" },
    { id: 2, name: "Pasta Carbonara", price: 22.99, description: "Creamy pasta with pancetta and parmesan" },
    { id: 3, name: "Tiramisu", price: 8.99, description: "Classic Italian dessert with coffee and mascarpone" }
  ];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleMenuItems.map((item) => (
            <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center">
                <span className="text-gray-600 font-semibold">Food Image</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-600 mt-1">${item.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                <button className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 font-semibold">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
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

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-12 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          La Bella Vita is a family-owned Italian restaurant dedicated to bringing authentic flavors to your table. Our chefs use only the freshest ingredients to craft dishes that warm the heart and soul.
        </p>
      </section>

  
    </div>
  );
}