import React, { useEffect, useState } from "react";
import { categories } from "../utils/helpers";
import { getAllProducts } from "../api";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import SortAndFilter from "../components/SortAndFilter";
import { ClipLoader } from "react-spinners";
import {
  setProducts,
  setCategory,
  setSearchKeyword,
} from "../redux/reducers/productsReducer";

const HomePage = () => {
  //Pagination logic
  const [page, setPage] = useState(1);
  const [hasMoreProds, setHasMoreProds] = useState(true);
  const [loading, setLoading] = useState(false);
  const { products, sortBy, searchKeyword, category } = useSelector(
    (state) => state.products
  );
  const dispatch = useDispatch();

  const handleGetAllProducts = async (
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
  };

  const handleSelectedCategories = (categ) => {
    dispatch(setSearchKeyword(""));
    if (category === categ) {
      dispatch(setCategory(""));
    } else {
      dispatch(setCategory(categ));
    }
  };

  const loadMoreProducts = () => {
    if (hasMoreProds) {
      handleGetAllProducts(sortBy, true, searchKeyword, category, page + 1);
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    handleGetAllProducts(sortBy, true, searchKeyword, category, page);
  }, []);

  return (
    <div className="">
      {/* Category section  */}
      <section className="categories w-full flex items-center justify-start gap-4 p-4 bg-green-300 overflow-x-auto scrollbar-none">
        {categories.map((categoryOptions, index) => {
          const isActive = categoryOptions.pseudoName === category;
          return (
            <div
              key={index}
              onClick={() =>
                handleSelectedCategories(categoryOptions.pseudoName)
              }
              className={`flex justify-center items-center ${
                isActive ? "bg-green-600 text-white" : "bg-green-100"
              } rounded-xl px-2 py-1 hover:bg-green-600 hover:text-white cursor-pointer text-green-900`}
            >
              <div className="image min-w-12 h-12">
                <img src={categoryOptions.image} alt="" width={40} />
              </div>
              <div className="max-w-20 md:max-w-30 text-sm font-bold">
                {categoryOptions.title}
              </div>
            </div>
          );
        })}
      </section>

      {/* Filter and Sort options */}
      <SortAndFilter page={page} />

      {/* Products Section */}
      <section className="w-full min-h-[80vh] pr-8 py-2 bg-green-50 mx-auto">
        {loading ? (
          <div className="w-full h-[70vh] flex justify-center items-center">
            <span className="text-green-800 font-bold text-2xl">
              <ClipLoader size={50} />
            </span>
          </div>
        ) : products?.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {products?.map((product) => {
              return <ProductCard product={product} key={product._id} />;
            })}
          </div>
        ) : (
          <div className="w-full h-[70vh] flex justify-center pt-8">
            <span className="text-green-800 font-bold text-2xl">
              No Products Found.
            </span>
          </div>
        )}

        <div className="bg-green-50 flex justify-center items-center h-20">
          <button
            onClick={loadMoreProducts}
            disabled={!hasMoreProds}
            className={`${
              hasMoreProds
                ? "bg-green-700 hover:bg-green-900 hover:scale-[103%] active:scale-[97%]"
                : "bg-red-600 cursor-not-allowed"
            }  text-white text-sm font-bold py-1 px-2 rounded flex justify-center items-center gap-1 w-35 duration-150 transition-all`}
          >
            {loading ? (
              <ClipLoader size={20} className="w-35" color="#fff" />
            ) : hasMoreProds ? (
              "Load More"
            ) : (
              "No More Products"
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
