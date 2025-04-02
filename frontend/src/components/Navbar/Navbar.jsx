// src/components/Navbar/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-math-blue shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-white text-2xl font-bold">Pi-Calculator</span>
          </Link>
          <div className="flex space-x-6">
            <Link 
              to="/matrix" 
              className="text-white hover:text-gray-200 transition-colors"
            >
              Matrix
            </Link>
            <Link 
              to="/numerical" 
              className="text-white hover:text-gray-200 transition-colors"
            >
              Numerical Analysis
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}