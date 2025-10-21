import React, { Fragment, useEffect, useState, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Popover, Dialog, Transition } from "@headlessui/react";
import { ArrowDownUp, ChevronDown, Check, Filter, X } from 'lucide-react';
import { getAllProducts } from "../api";
import { calculateAverageRating, sortOptions } from "../utils/helpers";
import { setProducts, setSortBy } from "../redux/reducers/productsReducer";

const SortAndFilter = memo(({ page }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const { products, sortBy, searchKeyword, category } = useSelector(
    (state) => state.products
  );
  const [filterValues, setFilterValues] = useState({
    price: { min: 1, max: 20000 },
    rating: 0,
    fastDelivery: false,
    inStock: false,
  });
  const dispatch = useDispatch();

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    
    // Check price range (only if different from defaults)
    if (filterValues.price.min !== 1 || filterValues.price.max !== 20000) {
      count++;
    }
    
    // Check rating (only if greater than 0)
    if (filterValues.rating > 0) {
      count++;
    }
    
    // Check fast delivery
    if (filterValues.fastDelivery) {
      count++;
    }
    
    // Check in stock
    if (filterValues.inStock) {
      count++;
    }
    
    return count;
  }, [filterValues]);

  const handleGetAllProducts = async (
    sortBy,
    resetFilters,
    searchKeyword,
    category,
    page
  ) => {
    try {
      const prods = await getAllProducts(
        sortBy,
        resetFilters ? {} : filterValues,
        searchKeyword,
        category,
        page
      );
      dispatch(setProducts(prods.filteredProducts));
    } catch (error) {
      console.log(`Error fetching products: ${error}`);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedFilters = { ...filterValues };
    const parts = name.split(".");

    if (name === "rating") {
      let len = 0,
        ratingSum = 0;
      products?.map((product) => {
        ratingSum += calculateAverageRating(product.reviews);
        len++;
      });
      let avgRating = ratingSum / len;
      console.log(avgRating);
      updatedFilters[name] = value === "" ? undefined : avgRating;
    }

    if (type === "checkbox") {
      updatedFilters[name] = checked;
    } else if (parts.length === 2) {
      const [objKey, key] = parts;
      updatedFilters[objKey] = updatedFilters[objKey] || {};
      updatedFilters[objKey][key] =
        value === "" ? undefined : parseFloat(value);
    } else {
      updatedFilters[name] = value === "" ? undefined : value;
    }

    setFilterValues(updatedFilters);
    console.log(updatedFilters);
  };

  useEffect(() => {
    handleGetAllProducts(sortBy, false, searchKeyword, category, page);
  }, [sortBy, searchKeyword, filterValues, category, page]);

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
      <div className="left">
        <button
          onClick={() => setFilterOpen(true)}
          className="group inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-emerald-200 hover:border-emerald-300 relative"
        >
          <Filter className="text-emerald-600 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700">
            Filters
          </span>
          
          {/* Active Filters Badge */}
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse-slow">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <Transition.Root show={filterOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={setFilterOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-300"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-200"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute left-0 top-0 -ml-10 flex pr-2 pt-6">
                          <button
                            type="button"
                            className="rounded-full bg-white p-2 text-gray-600 hover:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
                            onClick={() => setFilterOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                      </Transition.Child>

                      <div className="flex h-full flex-col overflow-y-auto bg-white shadow-2xl">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8">
                          <Dialog.Title className="text-2xl font-bold text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Filter className="text-white/90" />
                              Filter Products
                            </div>
                            {activeFiltersCount > 0 && (
                              <span className="flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full">
                                {activeFiltersCount}
                              </span>
                            )}
                          </Dialog.Title>
                        </div>

                        <div className="flex-1 px-6 py-8 space-y-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Price Range
                            </label>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <input
                                  type="number"
                                  id="price-min"
                                  name="price.min"
                                  value={filterValues.price.min || ""}
                                  onChange={handleFilterChange}
                                  placeholder="Min"
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                />
                              </div>
                              <span className="text-gray-400 font-medium">—</span>
                              <div className="flex-1">
                                <input
                                  type="number"
                                  id="price-max"
                                  name="price.max"
                                  value={filterValues.price.max || ""}
                                  onChange={handleFilterChange}
                                  placeholder="Max"
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="rating"
                              className="block text-sm font-semibold text-gray-700 mb-3"
                            >
                              Minimum Rating
                            </label>
                            <input
                              type="number"
                              id="rating"
                              name="rating"
                              value={filterValues.rating || ""}
                              onChange={handleFilterChange}
                              min="0"
                              max="5"
                              step="0.1"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            />
                          </div>

                          <div className="space-y-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center">
                              <input
                                id="fastDelivery"
                                name="fastDelivery"
                                type="checkbox"
                                checked={filterValues.fastDelivery}
                                onChange={handleFilterChange}
                                className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                              />
                              <label
                                htmlFor="fastDelivery"
                                className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                              >
                                Fast Delivery Only
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                id="inStock"
                                name="inStock"
                                type="checkbox"
                                checked={filterValues.inStock}
                                onChange={handleFilterChange}
                                className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                              />
                              <label
                                htmlFor="inStock"
                                className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                              >
                                In Stock Only
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                handleGetAllProducts(
                                  sortBy,
                                  true,
                                  searchKeyword,
                                  category,
                                  page
                                );
                                setFilterOpen(false);
                                setFilterValues({
                                  price: { min: 1, max: 20000 },
                                  rating: 0,
                                  fastDelivery: false,
                                  inStock: false,
                                });
                              }}
                              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 active:scale-95 transition-all duration-200"
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => {
                                handleGetAllProducts(
                                  sortBy,
                                  false,
                                  searchKeyword,
                                  category,
                                  page
                                );
                                setFilterOpen(false);
                              }}
                              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-semibold text-white hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all duration-200 shadow-lg"
                            >
                              Apply Filters
                            </button>
                          </div>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>

      <div className="right">
        <Popover className="relative">
          <Popover.Button className="group inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-emerald-200 hover:border-emerald-300">
            <ArrowDownUp className="text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700">
              Sort by
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 z-10 mt-3 w-64">
              <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-gray-900/5">
                <div className="p-2">
                  {sortOptions.map((option, index) => (
                    <Popover.Button
                      key={index}
                      onClick={() => {
                        handleGetAllProducts(
                          option.name,
                          false,
                          searchKeyword,
                          category
                        );
                        dispatch(setSortBy(option.name));
                      }}
                      className="w-full group relative flex items-center justify-between gap-x-4 rounded-lg px-4 py-3 hover:bg-emerald-50 transition-colors duration-150"
                    >
                      <span className="font-medium text-gray-700 group-hover:text-emerald-700">
                        {option.name}
                      </span>
                      {sortBy && option.name === sortBy && (
                        <Check
                          className="text-emerald-600"
                          aria-hidden="true"
                        />
                      )}
                    </Popover.Button>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
});

export default SortAndFilter;