import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  ShoppingBag, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle2,
  Clock,
  Receipt
} from "lucide-react";
import { getAllOrders } from "../api";

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [userOrdersCount, setUserOrdersCount] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleGetAllOrders = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await getAllOrders();
      setOrders(() => fetchedOrders.orders);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  const handleOnClick = (order) => {
    navigate(`/order/${order._id}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Clock className="w-4 h-4" />;
      case "Shipped":
        return <Truck className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  useEffect(() => {
    handleGetAllOrders();
  }, []);

  useEffect(() => {
    setUserOrdersCount(() => {
      return orders.some((order) => {
        return user._id === order.user;
      });
    });
  }, [orders]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {orders?.length === 0 && loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <Receipt className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-600" />
            </div>
            <p className="mt-6 text-green-800 font-semibold text-lg">
              Loading your orders...
            </p>
          </div>
        ) : !userOrdersCount ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="mb-8 relative">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-green-600" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                No Orders Yet
              </h2>
              <p className="text-gray-600 mb-8">
                Start shopping to see your orders here!
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  My Orders
                </h1>
              </div>
              <p className="text-gray-600 ml-15">
                Track and manage your orders
              </p>
            </div>

            {/* Orders Grid */}
            <div className="space-y-4">
              {orders?.map(
                (order, index) =>
                  user._id === order.user && (
                    <div
                      key={index}
                      className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl border border-green-100 overflow-hidden transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                          {/* Order ID */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-1 font-medium">
                              Order ID
                            </p>
                            <p className="text-sm font-mono font-semibold text-gray-800 truncate">
                              {order._id}
                            </p>
                          </div>

                          {/* Amount */}
                          <div className="flex-shrink-0">
                            <p className="text-xs text-gray-500 mb-1 font-medium">
                              Total Amount
                            </p>
                            <p className="text-2xl font-bold text-green-700">
                              ₹{order.total}
                            </p>
                          </div>

                          {/* Quantity */}
                          <div className="flex-shrink-0">
                            <p className="text-xs text-gray-500 mb-1 font-medium">
                              Items
                            </p>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-600" />
                              <p className="text-lg font-semibold text-gray-800">
                                {order.orderItems.length}
                              </p>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="flex-shrink-0">
                            <p className="text-xs text-gray-500 mb-2 font-medium">
                              Status
                            </p>
                            <span
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>

                          {/* View Button */}
                          <div className="flex-shrink-0">
                            <button
                              onClick={() => handleOnClick(order)}
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                              <Eye className="w-5 h-5" />
                              <span>View</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
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

export default Orders;