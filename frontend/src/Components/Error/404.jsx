import React from "react";
import { Link } from "react-router-dom";
import LOGO from '../../assets/img/logo.png';

function Error() {
  document.title = "Error";
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <img src={LOGO} alt="Logo" className="w-32 sm:w-48 md:w-64 mb-8" /> {/* add the logo image here */}
      <div className="max-w-md mx-auto text-center">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-8">
          Oops!
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-700 mb-8">
          We can't seem to find the page you're looking for.
        </div>
        <div className="text-base sm:text-lg md:text-xl text-gray-600 mb-8">
          The page may have been removed or the link may be broken. Let's take
          you back to our homepage.
        </div>
        <Link
          to="/"
          className="bg-blue-600 text-white py-3 px-8 sm:px-10 rounded-full shadow-md hover:bg-blue-700"
        >
          Go back to homepage
        </Link>
      </div>
    </div>
  );
}

export default Error;
