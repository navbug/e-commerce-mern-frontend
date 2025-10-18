// components/OfflineBanner.jsx
import React from "react";
import { WifiOff, RefreshCw } from "lucide-react";

const OfflineBanner = ({ isOnline }) => {
  if (isOnline) return null;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <WifiOff className="w-6 h-6 animate-pulse" />
              <div className="absolute inset-0 bg-white rounded-full blur-md opacity-30 animate-ping"></div>
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base">
                No Internet Connection
              </p>
              <p className="text-xs text-red-100 hidden sm:block">
                Please check your network and try again
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Retry</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OfflineBanner;