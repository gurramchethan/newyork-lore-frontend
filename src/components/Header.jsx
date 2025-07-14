import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Stories', to: '/stories' },
    { name: 'Submit', to: '/submit' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-900 shadow-md border-b border-emerald-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-emerald-400 hover:text-emerald-300 transition duration-300"
          >
            New York Lore
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium px-4 py-2 rounded-md transition duration-300 ease-in-out ${
                    isActive ? 'text-white bg-emerald-700' : 'text-emerald-300 hover:text-white hover:bg-emerald-600/20'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-emerald-300 hover:text-white focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-2 py-4">
            {navLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block text-sm font-medium px-4 py-2 rounded-md transition duration-300 ${
                    isActive ? 'text-white bg-emerald-700' : 'text-emerald-300 hover:text-white hover:bg-emerald-600/20'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
