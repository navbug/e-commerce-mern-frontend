import React, { useEffect, useState } from "react";
import { setProducts } from "../../redux/reducers/productsReducer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { deleteProduct, getAllProductsManage } from "../../api";
import { ClipLoader } from "react-spinners";
import {
  Package,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  DollarSign,
  Box,
} from "lucide-react";

const ManageProducts = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = products?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleGetAllProducts = async () => {
    try {
      setLoading(true);
      const prods = await getAllProductsManage();
      dispatch(setProducts(prods.filteredProducts));
      setLoading(false);
    } catch (error) {
      console.log(`Error fetching products: ${error}`);
    }
  };

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  const handleDeleteProduct = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      handleGetAllProducts();
    } catch (error) {
      console.log("Error deleting product:", error);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Manage Products
              </h1>
              <p className="text-gray-600 text-sm">
                {products?.length || 0} products available
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/admin/addProduct`)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-600" />
          </div>
          <p className="mt-6 text-green-800 font-semibold text-lg">
            Loading products...
          </p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-green-100 overflow-hidden">
          {/* Products List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-100 to-emerald-100 border-b-2 border-green-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {currentProducts?.map((product, index) => (
                  <tr
                    key={index}
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="group cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <span className="text-gray-600 font-semibold">
                        {indexOfFirstProduct + index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-gradient-to-br from-green-50 to-emerald-50">
                          <img
                            className="w-full h-full object-cover"
                            src={
                              product?.images ||
                              "https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png"
                            }
                            alt={product.title}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800 truncate group-hover:text-green-700 transition-colors">
                            {product.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {product.category || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-gray-800">
                          ₹{product.price}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                          product.stock > 10
                            ? "bg-green-100 text-green-700"
                            : product.stock > 0
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <Box className="w-3 h-3" />
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/editProduct/${product._id}`);
                          }}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Edit Product"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteProduct(e, product._id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-t border-green-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstProduct + 1} to{" "}
                {Math.min(indexOfLastProduct, products?.length || 0)} of{" "}
                {products?.length || 0} products
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-200 rounded-xl font-semibold text-gray-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl">
                  {currentPage}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={indexOfLastProduct >= (products?.length || 0)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-200 rounded-xl font-semibold text-gray-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white hover:scale-105 active:scale-95"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ManageProducts;