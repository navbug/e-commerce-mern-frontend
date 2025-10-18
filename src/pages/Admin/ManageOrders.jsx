import React, { useState, useEffect } from "react";
import { deleteOrder, getAllOrders } from "../../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import {
  ShoppingBag,
  Eye,
  Trash2,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  Receipt,
} from "lucide-react";

const ManageOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const handleGetAllOrders = async () => {
    try {
      setLoading(true);
      const orders = await getAllOrders();
      setOrders(orders.orders);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  const handleOnClick = (order) => {
    navigate(`/order/${order._id}`);
  };

  const handleDelete = async (e, orderId) => {
    e.stopPropagation();
    try {
      await deleteOrder(orderId);
      handleGetAllOrders();
      toast.success("Order deleted successfully");
    } catch (error) {
      console.log("Error deleting order:", error);
    }
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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
            <p className="text-gray-600 text-sm">
              {orders?.length || 0} total orders
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <Receipt className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-600" />
          </div>
          <p className="mt-6 text-green-800 font-semibold text-lg">
            Loading orders...
          </p>
        </div>
      ) : orders?.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px] max-h-[700px] overflow-y-auto">
          <div className="text-center">
            <div className="mb-8 relative">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-blue-600" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              No Orders Yet
            </h2>
            <p className="text-gray-600">Orders will appear here once placed</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-green-100 overflow-hidden">
          {/* Orders List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-100 to-emerald-100 border-b-2 border-green-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {orders?.map((order, index) => (
                  <tr
                    key={`${order._id}-${index}`}
                    onClick={() => handleOnClick(order)}
                    className="group cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-sm font-semibold text-gray-700">
                          {order._id.slice(0, 12)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-800">
                        ₹{order.total}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-700">
                          {order.orderItems.length}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOnClick(order);
                          }}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="View Order"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, order._id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Delete Order"
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

          {/* Footer Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-t border-blue-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Total: {orders?.length || 0} orders
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">
                    {orders?.filter((o) => o.status === "Processing").length ||
                      0}{" "}
                    Processing
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">
                    {orders?.filter((o) => o.status === "Shipped").length || 0}{" "}
                    Shipped
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">
                    {orders?.filter((o) => o.status === "Delivered").length ||
                      0}{" "}
                    Delivered
                  </span>
                </div>
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

export default ManageOrders;