import React, { Fragment, useEffect, useState } from "react";
import { Popover, Dialog, Transition } from "@headlessui/react";
import { FaSort, FaAngleDown, FaCheck, FaFilter } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { getAllProducts } from "../api";
import { calculateAverageRating, sortOptions } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setSortBy } from "../redux/reducers/productsReducer";

const SortAndFilter = ({page}) => {
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

    // Create a copy of the filterValues object
    const updatedFilters = { ...filterValues };

    // Split the name into parts to handle nested objects
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
      // If it's a checkbox input
      updatedFilters[name] = checked;
    } else if (parts.length === 2) {
      // If it's a nested object (like 'price.min' or 'price.max')
      const [objKey, key] = parts;
      // Ensure price object exists in updatedFilters
      updatedFilters[objKey] = updatedFilters[objKey] || {};
      // Update the specific key within the nested object
      updatedFilters[objKey][key] =
        value === "" ? undefined : parseFloat(value);
    } else {
      // Otherwise, handle as a regular key-value pair
      updatedFilters[name] = value === "" ? undefined : value;
    }

    // Set the updated state
    setFilterValues(updatedFilters);
    console.log(updatedFilters);
  };

  useEffect(() => {
    handleGetAllProducts(sortBy, false, searchKeyword, category, page);
  }, [sortBy, searchKeyword, filterValues, category, page]);

  return (
    <div className="flex justify-between items-center pl-5 pr-7 py-2 bg-green-50">
      <div className="left">
        <div
          onClick={() => setFilterOpen(true)}
          className="inline-flex items-end gap-x-1 text-sm font-semibold leading-6 text-green-900 cursor-pointer"
        >
          <span className="flex items-center gap-1 text-[16px] duration-160 hover:scale-105">
            <FaFilter />
            Filters:{" "}
          </span>
          {/* <FaAngleDown className="h-5 w-5" aria-hidden="true" /> */}
        </div>
        {/* <span onClick={() => setFilterOpen(true)}>Filters: </span> */}
        <Transition.Root show={filterOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setFilterOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-green-50 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="pointer-events-auto relative w-screen max-w-[380px]">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                          <button
                            type="button"
                            className="relative rounded-md text-red ring-2 ring-green-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                            onClick={() => setFilterOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <IoClose className="h-7 w-7" color="darkgreen" />
                          </button>
                        </div>
                      </Transition.Child>
                      <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                          <div className="left px-4 sm:px-6 flex flex-col gap-3">
                            <div className="font-semibold leading-6 text-green-900 text-lg mb-3">
                              Filters:
                            </div>
                            <div className="mb-4 text-green-900">
                              <label
                                htmlFor="price"
                                className="block font-medium mb-2"
                              >
                                Price
                              </label>
                              <div className="flex items-center text-green-900">
                                <input
                                  type="number"
                                  id="price-min"
                                  name="price.min"
                                  value={filterValues.price.min || ""}
                                  onChange={handleFilterChange}
                                  placeholder="Min"
                                  className="w-1/2 mr-2 border-green-300 rounded-md shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                />
                                <input
                                  type="number"
                                  id="price-max"
                                  name="price.max"
                                  value={filterValues.price.max || ""}
                                  onChange={handleFilterChange}
                                  placeholder="Max"
                                  className="w-1/2 border-green-300 rounded-md shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                />
                              </div>
                            </div>
                            <div className="mb-4 text-green-900">
                              <label
                                htmlFor="rating"
                                className="block font-medium mb-2"
                              >
                                Rating
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
                                className="w-full border-green-300 rounded-md shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                              />
                            </div>
                            <div className="mb-4">
                              <div className="flex items-center">
                                <input
                                  id="fastDelivery"
                                  name="fastDelivery"
                                  type="checkbox"
                                  checked={filterValues.fastDelivery}
                                  onChange={handleFilterChange}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                                />
                                <label
                                  htmlFor="fastDelivery"
                                  className="ml-2 block text-sm text-green-900 font-bold"
                                >
                                  Fast Delivery
                                </label>
                              </div>
                            </div>
                            <div className="mb-4">
                              <div className="flex items-center">
                                <input
                                  id="inStock"
                                  name="inStock"
                                  type="checkbox"
                                  checked={filterValues.inStock}
                                  onChange={handleFilterChange}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                                />
                                <label
                                  htmlFor="inStock"
                                  className="ml-2 block text-sm text-green-900 font-bold"
                                >
                                  In Stock
                                </label>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
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
                                className=" flex justify-between items-center gap-2 px-2 py-1  rounded-md border-green-700 border-2 cursor-pointer group duration-150 hover:bg-green-700 hover:shadow-md active:scale-95"
                              >
                                <p className="text-green-900 group-hover:text-white">
                                  Reset Filters
                                </p>
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
                                className=" flex justify-between items-center gap-2 px-2 py-1  rounded-md border-green-700 border-2 cursor-pointer group duration-150 hover:bg-green-700 hover:shadow-md active:scale-95"
                              >
                                <p className="text-green-900 group-hover:text-white">
                                  Apply Filters
                                </p>
                              </button>
                            </div>
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
          <Popover.Button className="inline-flex items-end gap-x-1 text-sm font-semibold text-green-900">
            <span className="flex items-center gap-1 text-[16px] duration-160 hover:scale-105">
              <FaSort />
              Sort by: <FaAngleDown className="h-5 w-5" aria-hidden="true" />
            </span>
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
            <Popover.Panel className="absolute -right-4 z-10 px-4">
              <div className="w-[220px] max-w-sm flex-auto overflow-hidden rounded-xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                <div className="p-2">
                  {sortOptions.map((option, index) => (
                    <div
                      onClick={() => {
                        handleGetAllProducts(
                          option.name,
                          false,
                          searchKeyword,
                          category
                        );
                        dispatch(setSortBy(option.name));
                      }}
                      key={index}
                      className="group relative flex gap-x-6 rounded-md p-4 hover:bg-green-50 justify-between"
                    >
                      <Popover.Button>
                        <div className="font-semibold text-green-900">
                          {option.name}
                          <span className="absolute inset-0" />
                        </div>
                      </Popover.Button>
                      <div>
                        {sortBy && option.name === sortBy && (
                          <FaCheck
                            className="text-green-700"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </div>
    </div>
  );
};

export default SortAndFilter;
