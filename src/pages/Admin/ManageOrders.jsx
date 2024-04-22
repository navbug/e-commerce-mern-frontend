import React, { useState, useEffect } from "react";
import { VscPreview } from "react-icons/vsc";
import { MdDeleteForever } from "react-icons/md";
import { deleteOrder, getAllOrders } from "../../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FiShoppingBag } from "react-icons/fi";

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

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId);
      handleGetAllOrders();
      toast.success("Order deleted successfully");
    } catch (error) {
      console.log("Error deleting order:", error);
    }
  };

  useEffect(() => {
    handleGetAllOrders();
  }, []);

  return (
    <div className="main col-span-9 w-full flex-1">
      <h2 className="font-bold mb-3 mt-6 mx-2 text-green-800">Manage Orders</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <span className="text-green-900 font-bold text-xl">
            <ClipLoader size={50} />
          </span>
        </div>
      ) : orders?.length === 0 ? (<div className="bg-green-50 w-full h-[90vh] flex flex-col justify-start items-center gap-4 pt-20">
      <FiShoppingBag size={80} className="text-green-500" />{" "}
      <span className="text-green-900 font-bold text-2xl">
        No Recent Orders
      </span>
    </div>) : (
        <div className="overflow-x-auto max-w-[800px]">
          <table className="min-w-full divide-y divide-green-700">
            <thead className="bg-green-300">
              <tr className="bg-green-300">
                <th className="px-4 py-2 text-green-800">Order ID</th>
                <th className="px-4 py-2 text-green-800">Amount</th>
                <th className="px-4 py-2 text-green-800">Quantity</th>
                <th className="px-4 py-2 text-green-800">Status</th>
                <th className="px-4 py-2 text-green-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order, index) => (
                <tr
                  key={`${order._id}-${index}`}
                  className="border-b cursor-pointer hover:bg-green-200 text-green-800 font-semibold"
                >
                  <td className="px-4 py-2">
                    {order._id.slice(0, 9).concat("...")}
                  </td>
                  <td className="px-4 py-2">₹ {order.total}</td>
                  <td className="px-4 py-2">{order.orderItems.length}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex justify-start items-center gap-6">
                    <span className="cursor-pointer">
                      <VscPreview
                        onClick={() => handleOnClick(order)}
                        color="#555"
                        size={26}
                      />
                    </span>
                    <span className="cursor-pointer">
                      <MdDeleteForever
                        color="#ff0110"
                        size={30}
                        onClick={() => handleDelete(order._id)}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
