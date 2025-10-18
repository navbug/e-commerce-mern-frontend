import React from "react";

const ProductDetailsShimmer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      {/* Product Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-12">
            {/* Image Section Shimmer - Large Block */}
            <div className="flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl h-[500px] animate-pulse">
              {/* Single large shimmer block for entire image area */}
            </div>

            {/* Product Info Section Shimmer - Large Blocks */}
            <div className="flex flex-col gap-6">
              {/* Title Block */}
              <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>

              {/* Price Block */}
              <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>

              {/* Features Block */}
              <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>

              {/* Buttons Block */}
              <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsShimmer;