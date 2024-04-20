import React, { useState, useEffect } from "react";
import { VscPreview } from "react-icons/vsc";
import { getAllOrders } from "../api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { FiShoppingBag } from "react-icons/fi";

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
    <div className="flex flex-col p-4 h-[90vh] main col-span-9 w-full flex-1 bg-green-50">
      {orders?.length === 0 && loading ? (
        <div className="flex justify-center items-center">
          <span className="text-green-900 font-bold text-xl">
            <ClipLoader size={50} />
          </span>
        </div>
      ) : !userOrdersCount ? (
        <div className="bg-green-50 w-full h-[90vh] flex flex-col justify-start items-center gap-4 pt-20">
          <FiShoppingBag size={80} className="text-green-500" />{" "}
          <span className="text-green-900 font-bold text-2xl">
            No Recent Orders
          </span>
        </div>
      ) : (
        <div>
          <h2 className="font-bold mb-3 mt-6 mx-2 text-green-900">My Orders</h2>
          <div className="overflow-x-auto max-w-[800px]">
            <table className="min-w-full divide-y divide-gray-200 max-w-2xl">
              <thead className="bg-green-50">
                <tr className="bg-green-200 text-green-950">
                  <th className="px-4 py-2">Product ID</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map(
                  (order, index) =>
                    user._id === order.user && (
                      <tr
                        key={index}
                        className="border-b font-semibold text-green-950"
                      >
                        <td className="px-4 py-2">
                          {order._id.slice(0, 9).concat("...")}
                        </td>
                        <td className="px-4 py-2">₹ {order.total}</td>
                        <td className="px-4 py-2">{order.orderItems.length}</td>
                        <td
                          className={`px-4 py-2 font-semibold ${
                            order.status === "Processing"
                              ? "text-red-600"
                              : "text-green-700"
                          }`}
                        >
                          {order.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex justify-start items-center gap-6">
                          <span className="cursor-pointer">
                            <VscPreview
                              onClick={() => handleOnClick(order)}
                              color="#555"
                              size={26}
                            />
                          </span>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
