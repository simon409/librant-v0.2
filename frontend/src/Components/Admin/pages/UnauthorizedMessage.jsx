import React from 'react';
import { FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UnauthorizedMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center mb-8">
        <FaLock className="text-gray-700 text-6xl md:text-9xl mb-4" />
        <h1 className="text-3xl md:text-5xl font-bold text-gray-700 mb-8" style={{ color: "#00b4d8" }}>
          401 Unauthorized
        </h1>
      </div>
      <p className="text-base md:text-lg text-gray-700 max-w-md text-center mb-8">
        You do not have permission to access this page. Please contact an administrator if you believe this is a mistake.
      </p>
      <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200">
        <Link to="/">Go back</Link>
      </button>
    </div>
  );
};

export default UnauthorizedMessage;
