import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  Package,
  User,
  MapPin,
  Clock,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Home,
} from "lucide-react";
import {
  getOrderById,
  getUserById,
  processOrder,
  updateProductStock,
} from "../api";
import { adminIds } from "../utils/helpers";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [orderUser, setOrderUser] = useState("");
  const { user } = useSelector((state) => state.user);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const isAdmin = useMemo(() => {
    return adminIds.includes(user?._id)
  }, [user]);

  const getOrderUserById = useCallback(async (id) => {
    try {
      const { name } = await getUserById(id);
      setOrderUser(name);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getOrderDetails = useCallback(async () => {
    try {
      const fetchedOrder = await getOrderById(orderId);
      setOrder(fetchedOrder);
      getOrderUserById(fetchedOrder?.user);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error(`Failed to fetch order`);
    }
  }, []);

  const handleProcessOrder = useCallback(async (orderId, status) => {
    try {
      let newStatus;
      if (status === "Processing") {
        newStatus = "Shipped";

        const updateProducts = order.orderItems;
        for (let i = 0; i < updateProducts.length; i++) {
          await updateProductStock(
            updateProducts[i]._id,
            updateProducts[i].stock - updateProducts[i].quantity
          );
        }
        toast.success("Order shipped");
      } else if (status === "Shipped") {
        newStatus = "Delivered";
        toast.success("Order Delivered");
      }
      await processOrder(orderId, newStatus);
      navigate(`/admin/dashboard`);
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error(`Failed to process order`);
    }
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Clock className="w-5 h-5" />;
      case "Shipped":
        return <Truck className="w-5 h-5" />;
      case "Delivered":
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
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
    getOrderDetails();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {order && (
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Order Details
                </h1>
                <p className="text-sm text-gray-600 font-mono">#{orderId}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-green-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6 text-green-600" />
                  Order Items
                </h2>

                <div className="space-y-3">
                  {order?.orderItems?.map((item, index) => (
                    <Link
                      to={`/products/${item._id}`}
                      key={index}
                      className="group block bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-green-700 transition-colors">
                            {item?.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-gray-600">
                              <span className="font-semibold text-green-700">₹{item?.price}</span>
                              {" × "}
                              <span className="font-semibold">{item?.quantity}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-2xl font-bold text-green-700">
                            ₹{item?.price * item?.quantity}
                          </span>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Order Total */}
                <div className="mt-6 pt-6 border-t-2 border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">
                      Order Total
                    </span>
                    <span className="text-3xl font-bold text-green-700">
                      ₹{order?.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Info */}
            <div className="space-y-4">
              {/* Status Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-green-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Order Status
                </h2>
                <div
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl text-lg font-semibold border-2 ${getStatusColor(
                    order?.status
                  )}`}
                >
                  {getStatusIcon(order?.status)}
                  {order?.status}
                </div>

                {isAdmin && (
                  <button
                    disabled={order?.status === "Delivered"}
                    onClick={() => handleProcessOrder(order?._id, order?.status)}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {order.status === "Delivered" ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Delivered
                      </>
                    ) : order?.status === "Processing" ? (
                      <>
                        <Truck className="w-5 h-5" />
                        Ship Order
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Mark as Delivered
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Customer Info */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-green-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Customer Info
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Name</p>
                      <p className="text-gray-800 font-semibold">{orderUser}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-green-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-green-600" />
                  Shipping Address
                </h2>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {order?.shippingInfo?.address}
                      <br />
                      {order?.shippingInfo?.city}, {order?.shippingInfo?.state}
                      <br />
                      {order?.shippingInfo?.country} - {order?.shippingInfo?.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-green-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Payment
                </h2>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">
                    Online Payment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .delay-700 {
          animation-delay: 700ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

export default OrderDetails;