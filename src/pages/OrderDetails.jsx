import React, { useEffect, useState } from "react";
import {
  getOrderById,
  getUserById,
  processOrder,
  updateProductStock,
} from "../api";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { adminIds } from "../utils/helpers";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [orderUser, setOrderUser] = useState("");
  const { user } = useSelector((state) => state.user);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const getOrderUserById = async (id) => {
    try {
      const { name } = await getUserById(id);
      setOrderUser(name);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrderDetails = async () => {
    try {
      const fetchedOrder = await getOrderById(orderId);
      setOrder(fetchedOrder);
      getOrderUserById(fetchedOrder?.user);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error(`Failed to fetch order`);
    }
  };

  const handleProcessOrder = async (orderId, status) => {
    try {
      let newStatus;
      if (status === "Processing") {
        newStatus = "Shipped";

        //Update product(s) stock
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
  };

  useEffect(() => {
    getOrderDetails();
  }, [orderId]);

  return (
    <div className="bg-green-50 h-[90vh]">
      {order && (
        <div className="flex flex-col md:flex-row justify-between gap-2 px-4 py-5 ">
          {/* Left Container */}
          <div className="max-w-2xl md:w-8/12 pr-4">
            <h2 className="text-2xl font-bold mb-4 text-green-900">Order Details:</h2>
            <div className="bg-green-50 rounded-lg mb-4 flex flex-col items-start gap-2">
              {order?.orderItems?.map((item, index) => (
                <Link to={`/products/${item._id}`}
                  key={index}
                  className="w-full flex gap-2 justify-between items-center p-2 bg-green-200 rounded-md  duration-150 transition-all hover:scale-[102%] active:scale-[92%]"
                >
                  <div className="w-20 flex gap-2">
                    <h3 className="text-md font-semibold text-green-950">{item?.title}</h3>
                  </div>
                  <p className="text-green-800 font-semibold">
                    Price: ${item?.price} x Quantity: {item?.quantity}
                  </p>
                  <p className="text-green-950 font-bold">
                    Total: ${item?.price * item?.quantity}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Container */}
          <div className="flex flex-col items-center md:items-start md:w-4/12 pl-4">
            <h2 className="text-2xl font-bold mb-4 text-green-900">Order Info:</h2>
            <div className="flex flex-col space-y-2">
              <p className="text-gray-800 font-semibold">
                <span className="text-green-800">Customer:</span> <span className="text-green-600">{orderUser}</span>
              </p>
              <p className="text-gray-800 font-semibold">
              <span className="text-green-800">Address:</span>{" "}
              <span className="text-green-600">
                {`${order?.shippingInfo?.address}, ${order?.shippingInfo?.city}, ${order?.shippingInfo?.state}, ${order?.shippingInfo?.country}, ${order?.shippingInfo?.pincode}`}
              </span>
              </p>
              <p className="text-gray-800 font-semibold">
              <span className="text-green-800">Status:</span>
                <span className={`px-4 py-2 font-semibold ${order.status === "Processing" ? "text-red-600" : "text-green-700"}`}>{order?.status}</span>
              </p>

              {adminIds.includes(user?._id) && (
                <button
                  disabled={order?.status === "Delivered"}
                  onClick={() => handleProcessOrder(order?._id, order?.status)}
                  className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded mr-2 flex w-[170px] justify-center items-center text-md  leading-6 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 gap-2  duration-150 transition-all hover:scale-[103%] active:scale-[97%]"
                >
                  {order.status === "Delivered"
                    ? "Delivered"
                    : order?.status === "Processing"
                    ? "Process Order"
                    : "Deliver Order"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
