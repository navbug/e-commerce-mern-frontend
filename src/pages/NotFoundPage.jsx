import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, ArrowLeft, Package } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center animate-fade-in-up">
          {/* 404 with Package Icon */}
          <div className="relative inline-block mb-8">
            <h1 className="text-[150px] sm:text-[200px] font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent leading-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <Package className="w-16 h-16 sm:w-20 sm:h-20 text-green-600 animate-bounce" />
                <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4 mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              The page you're looking for doesn't exist, check the URL again!
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:from-green-700 hover:to-emerald-700 hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 transform"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </button>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;