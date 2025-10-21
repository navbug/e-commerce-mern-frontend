import React from 'react';

const FallbackShimmer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header Shimmer */}
      {/* <div className="sticky top-0 z-50 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 backdrop-blur-lg shadow-lg border-b border-green-100">
        <header className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="hidden sm:block w-28 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            <div className="flex flex-1 max-w-2xl mx-8">
              <div className="w-full h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </header>
      </div> */}

      {/* Categories Shimmer */}
      <section className="sticky top-16 z-40 bg-white/80 backdrop-blur-lg shadow-md border-b border-green-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-200 animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid Shimmer */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-full h-64 bg-gray-200"></div>
              <div className="p-4 space-y-3">

                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>

                <div className="flex items-center justify-between pt-2">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>

                <div className="h-10 bg-gray-200 rounded-xl w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default FallbackShimmer;