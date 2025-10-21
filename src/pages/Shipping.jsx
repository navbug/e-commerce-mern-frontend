import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { MapPin, Home, Building2, Globe, Hash, CreditCard, ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "../../config";
import { saveShippingInfo } from "../redux/reducers/cartReducer";

const Shipping = () => {
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const { cartItems, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(saveShippingInfo(shippingInfo));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/payment/create`,
        { amount: total },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.data;
      navigate("/checkout", { state: data.clientSecret });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (cartItems.length <= 0) return navigate("/cart");
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/cart")}
          className="mb-6 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold transition-all duration-200 hover:translate-x-[-4px]"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </button>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Shipping Address
                </h1>
                <p className="text-green-50 mt-1">
                  Enter your delivery details
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Address Field */}
            <div className="group">
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Complete Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Home className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                </div>
                <input
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleOnChange}
                  type="text"
                  placeholder="House No., Building, Street, Area"
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                />
              </div>
            </div>

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label
                  htmlFor="city"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                  </div>
                  <input
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleOnChange}
                    type="text"
                    placeholder="Your City"
                    required
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                  />
                </div>
              </div>

              <div className="group">
                <label
                  htmlFor="state"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  State
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                  </div>
                  <input
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleOnChange}
                    type="text"
                    placeholder="Your State"
                    required
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                  />
                </div>
              </div>
            </div>

            {/* Country and Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label
                  htmlFor="country"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Country
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                  </div>
                  <select
                    id="country"
                    name="country"
                    required
                    value={shippingInfo.country}
                    onChange={handleOnChange}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 appearance-none cursor-pointer"
                  >
                    <option value="">Select Country</option>
                    <option value="india">India</option>
                  </select>
                </div>
              </div>

              <div className="group">
                <label
                  htmlFor="pincode"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Pincode
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                  </div>
                  <input
                    id="pincode"
                    required
                    type="number"
                    placeholder="123456"
                    name="pincode"
                    value={shippingInfo.pincode}
                    onChange={handleOnChange}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-green-700">
                  ₹{total}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .delay-700 {
          animation-delay: 700ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
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

export default Shipping;