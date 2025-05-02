// components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogOut = async (e) => {
    try {
      await axios.post(
        'http://localhost:8000/api/v1/users/logout',
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error completing the task:', error);
    }

    sessionStorage.clear();
    localStorage.clear();

    history.back();
    history.forward();
    window.onpopstate = function () {
      history.go(1);
    };

    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-lg border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <svg className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">EduQuery</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  to="/videos" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive('/videos') 
                      ? 'bg-purple-700/80 text-white shadow-md shadow-purple-500/20' 
                      : 'text-purple-200 hover:bg-purple-800/50 hover:text-white hover:shadow-md hover:shadow-purple-500/10'
                  }`}
                >
                  Videos
                </Link>
                <Link 
                  to="/history" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive('/history') 
                      ? 'bg-purple-700/80 text-white shadow-md shadow-purple-500/20' 
                      : 'text-purple-200 hover:bg-purple-800/50 hover:text-white hover:shadow-md hover:shadow-purple-500/10'
                  }`}
                >
                  History
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={handleLogOut}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 hover:from-purple-700 hover:via-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-purple-200 hover:text-white hover:bg-purple-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300 ease-in-out`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800/50 backdrop-blur-sm border-t border-purple-500/20">
          <Link 
            to="/videos" 
            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
              isActive('/videos') 
                ? 'bg-purple-700/80 text-white shadow-md shadow-purple-500/20' 
                : 'text-purple-200 hover:bg-purple-800/50 hover:text-white hover:shadow-md hover:shadow-purple-500/10'
            }`}
          >
            Search
          </Link>
          <Link 
            to="/history" 
            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
              isActive('/history') 
                ? 'bg-purple-700/80 text-white shadow-md shadow-purple-500/20' 
                : 'text-purple-200 hover:bg-purple-800/50 hover:text-white hover:shadow-md hover:shadow-purple-500/10'
            }`}
          >
            History
          </Link>
          <button
            onClick={handleLogOut}
            className="w-full flex items-center px-3 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 hover:from-purple-700 hover:via-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 mt-2"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
