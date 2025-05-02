import React from 'react';
import { Link } from 'react-router-dom';

const StartPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-lg p-8 shadow-2xl border-4 border-gray-300">
          {/* Left Column - Content */}
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to EduQuery
              </h1>
              <p className="text-gray-700">
                Your intelligent educational platform for seamless learning
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h2>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2 text-gray-800">
                  <span className="text-blue-600">🔍</span>
                  <span>YouTube Video Search</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-800">
                  <span className="text-blue-600">🎥</span>
                  <span>Educational Videos</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-800">
                  <span className="text-blue-600">📂</span>
                  <span>Content Analysis</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-800">
                  <span className="text-blue-600">🔒</span>
                  <span>Secure Authentication</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="flex-1">
                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium">
                  Get Started
                </button>
              </Link>
              <Link to="/register" className="flex-1">
                <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium">
                  Create Account
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Modern workspace with technology"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;