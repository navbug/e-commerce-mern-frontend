import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categories } from "../utils/helpers";
import { getAllProducts } from "../api";
import { ClipLoader } from "react-spinners";
import { Package, ChevronDown } from "lucide-react";
import ProductCard from "../components/ProductCard";
import SortAndFilter from "../components/SortAndFilter";
import {
  setProducts,
  setCategory,
  setSearchKeyword,
} from "../redux/reducers/productsReducer";
import ProductsShimmer from "../components/ProductsShimmer";

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [hasMoreProds, setHasMoreProds] = useState(true);
  const [loading, setLoading] = useState(false);
  const { products, sortBy, searchKeyword, category } = useSelector(
    (state) => state.products
  );
  const dispatch = useDispatch();

  const handleGetAllProducts = useCallback(async (
    sortBy,
    resetFilters,
    searchKeyword,
    category,
    page
  ) => {
    try {
      setLoading(true);
      const prods = await getAllProducts(
        sortBy,
        resetFilters,
        searchKeyword,
        category,
        page
      );
      dispatch(setProducts(prods.filteredProducts));
      setHasMoreProds(prods.hasMore);
      setLoading(false);
    } catch (error) {
      console.log(`Error fetching products: ${error}`);
    }
  } , []);

  const handleSelectedCategories = useCallback((categ) => {
    dispatch(setSearchKeyword(""));
    if (category === categ) {
      dispatch(setCategory(""));
    } else {
      dispatch(setCategory(categ));
    }
  }, [category]);

  const loadMoreProducts = useCallback(() => {
    if (hasMoreProds) {
      handleGetAllProducts(sortBy, true, searchKeyword, category, page + 1);
      setPage((prevPage) => prevPage + 1);
    }
  }, []);

  console.log(products);

  useEffect(() => {
    handleGetAllProducts(sortBy, true, searchKeyword, category, page);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="relative z-10">
        {/* Category Section */}
        <section className="sticky top-16 z-40 bg-white/80 backdrop-blur-lg shadow-md border-b border-green-100">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((categoryOptions, index) => {
                const isActive = categoryOptions.pseudoName === category;
                return (
                  <button
                    key={index}
                    onClick={() =>
                      handleSelectedCategories(categoryOptions.pseudoName)
                    }
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
                      isActive
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white scale-105"
                        : "bg-white text-gray-700 hover:bg-green-50"
                    }`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img
                        src={categoryOptions.image}
                        alt={categoryOptions.title}
                        loading="lazy"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <span className="text-sm whitespace-nowrap">
                      {categoryOptions.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Filter and Sort Options */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SortAndFilter page={page} />
        </div>

        {/* Products Section */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <ProductsShimmer count={8} />
          ) : products?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product, index) => (
                  <div
                    key={product._id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMoreProducts}
                  disabled={!hasMoreProds || loading}
                  className={`relative group px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 transform ${
                    hasMoreProds && !loading
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:scale-105 hover:shadow-xl active:scale-95"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <ClipLoader size={20} color="#fff" />
                      <span>Loading...</span>
                    </div>
                  ) : hasMoreProds ? (
                    <div className="flex items-center gap-2">
                      <span>Load More Products</span>
                      <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
                    </div>
                  ) : (
                    <span>No More Products</span>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <Package className="w-12 h-12 text-green-600" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </section>
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
          opacity: 0;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default HomePage;