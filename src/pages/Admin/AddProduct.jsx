import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Upload,
  Package,
  DollarSign,
  Box,
  FileText,
  Zap,
  Tag,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";
import { API_BASE_URL } from "../../../config";
import { addProduct } from "../../api";

const AddProduct = () => {
  const [image, setImage] = useState({ preview: "", data: "" });
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    stock: "",
    desc: "",
    ratings: 0,
    fastDelivery: false,
    category: "",
    images: "",
  });

  const navigate = useNavigate();

  const handleChange = (e, field) => {
    setNewProduct({ ...newProduct, [field]: e.target.value });
  };

  const handleCheckboxChange = (e, field) => {
    setNewProduct({ ...newProduct, [field]: e.target.checked });
  };

  const handleFileSelect = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (file) {
      if (file.size > 5000000) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const img = {
        preview: URL.createObjectURL(file),
        data: file,
      };
      setImage(img);
    }
  };

  const removeImage = () => {
    setImage({ preview: "", data: "" });
  };

  const handleFileUpload = async () => {
    let formData = new FormData();
    formData.append("file", image.data);
    const res = await axios.post(`${API_BASE_URL}/uploadFile`, formData);
    return res;
  };

  const addImage = async () => {
    const imgRes = await handleFileUpload();
    return imgRes;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!image.data) {
      toast.error("Please upload a product image");
      return;
    }

    if (!newProduct.title || !newProduct.price || !newProduct.stock || !newProduct.category) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const imgRes = await addImage();
      const productData = {
        ...newProduct,
        images: `${imgRes.data.fileUrl}`,
      };
      await addProduct(productData);
      toast.success("Product added successfully");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="mb-4 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold transition-all duration-200 hover:translate-x-[-4px]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Add New Product
                </h1>
                <p className="text-gray-600 text-sm">
                  Create a new product listing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-green-100 overflow-hidden">
          <form onSubmit={handleAddProduct}>
            <div className="p-8 space-y-6">
              {/* Product Image Upload */}
              <div className="flex justify-center">
                <div className="relative group">
                  {!image.data ? (
                    <label className="cursor-pointer">
                      <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-dashed border-green-300 flex flex-col items-center justify-center hover:border-green-500 hover:bg-green-50 transition-all duration-300 group-hover:scale-105">
                        <Upload className="w-12 h-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-lg font-semibold text-gray-700">
                          Upload Product Image
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          PNG, JPG, WEBP (Max 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".jpeg,.jpg,.png,.webp,.svg"
                        onChange={handleFileSelect}
                      />
                    </label>
                  ) : (
                    <div className="relative w-64 h-64">
                      <img
                        src={image.preview}
                        className="w-full h-full object-cover rounded-2xl border-4 border-white shadow-xl"
                        alt="Product preview"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Title */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={newProduct.title}
                    onChange={(e) => handleChange(e, "title")}
                    placeholder="Enter product name"
                    required
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    name="category"
                    value={newProduct.category}
                    onChange={(e) => handleChange(e, "category")}
                    placeholder="headphones, speakers"
                    required
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                  />
                </div>
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={(e) => handleChange(e, "price")}
                      placeholder="0.00"
                      required
                      min="0"
                      step="0.01"
                      className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Box className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                    </div>
                    <input
                      type="number"
                      name="stock"
                      value={newProduct.stock}
                      onChange={(e) => handleChange(e, "stock")}
                      placeholder="0"
                      required
                      min="0"
                      className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-4 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                  </div>
                  <textarea
                    name="desc"
                    value={newProduct.desc}
                    onChange={(e) => handleChange(e, "desc")}
                    rows={4}
                    placeholder="Describe your product..."
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 resize-none"
                  />
                </div>
              </div>

              {/* Fast Delivery */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <input
                  type="checkbox"
                  id="fastDelivery"
                  name="fastDelivery"
                  checked={newProduct.fastDelivery}
                  onChange={(e) => handleCheckboxChange(e, "fastDelivery")}
                  className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="fastDelivery"
                  className="flex items-center gap-2 text-gray-700 font-semibold cursor-pointer select-none"
                >
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Enable Fast Delivery
                </label>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-t border-green-100">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/dashboard")}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .delay-700 {
          animation-delay: 700ms;
        }

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

        /* Hide number input spinner */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;