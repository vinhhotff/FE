export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Restaurant Name</h3>
            <p className="text-gray-300">
              Experience the finest dining with our carefully crafted menu and exceptional service.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <div className="text-gray-300 space-y-2">
              <p>📍 123 Restaurant Street, City, State 12345</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>✉️ info@restaurant.com</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Hours</h3>
            <div className="text-gray-300 space-y-2">
              <p>Monday - Thursday: 11:00 AM - 10:00 PM</p>
              <p>Friday - Saturday: 11:00 AM - 11:00 PM</p>
              <p>Sunday: 12:00 PM - 9:00 PM</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Restaurant Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
