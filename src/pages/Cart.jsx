import React, { useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  changeQuantity,
  removeFromCart,
  calculatePrice,
} from "../redux/reducers/cartReducer";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleCartDeleteProduct = (id) => {
    dispatch(removeFromCart(id));
    toast.success(`Item removed from cart`);
  };

  const handleCartQtyChange = (id, qty) => {
    dispatch(changeQuantity({ id, qty }));
  };

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  if (cartItems.length === 0)
    return (
      <div className="bg-green-50 w-full h-[90vh] flex flex-col justify-start items-center gap-4 pt-20">
        <FiShoppingBag size={130} className="text-green-500" />{" "}
        <span className="text-green-900 font-bold text-4xl">Cart is empty</span>
      </div>
    );
  return (
    <div className="w-full h-full flex flex-col md:flex-row justify-center items-center md:items-start pb-4">
      <div className="left-container max-w-3xl min-w-[400px] w-[70%] p-3">
        <h1 className="text-center text-2xl underline py-2 text-green-900">
          Cart Items
        </h1>
        <span className="text-green-800 font-semibold pl-2">
          Total items: ({cartItems.length})
        </span>
        {cartItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-2 py-3 bg-green-200 rounded-md my-2"
          >
            <div className="flex justify-center items-center gap-2">
              <img
                className="w-20 bg-green-400 rounded-md"
                src={
                  item?.images
                    ? item?.images
                    : "https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png"
                }
                alt=""
              />
              <div className="flex flex-col gap-2">
                <h2 className="text-green-900 font-semibold max-w-20">
                  {item.title}
                </h2>
                <div>
                  <span className="text-green-800 text-[16px] font-bold">
                    ₹{` `}
                    {item.price}
                  </span>
                  <span className="text-green-600 font-bold text-sm">
                    {` `}x{item.quantity}
                  </span>
                </div>
              </div>
            </div>
            <div className="">
              <span
                onClick={() => {
                  if (item.quantity > 1) {
                    handleCartQtyChange(item._id, item.quantity - 1);
                  }
                }}
                className="w-9 px-3 py-1 bg-green-600 text-white text-lg font-bold rounded-l-md cursor-pointer"
                type="button"
              >
                -
              </span>
              <span className="px-3 py-2 bg-gray-100 text-green-950 text-lg font-bold">
                {item?.quantity}
              </span>
              <span
                onClick={() => {
                  if (item.quantity < item.stock) {
                    handleCartQtyChange(item._id, item.quantity + 1);
                  } else {
                    toast.info(`Item is out of stock`);
                  }
                }}
                className="w-9 px-3 py-1 bg-green-600 text-white text-lg font-bold rounded-r-md cursor-pointer"
                type="button"
              >
                +
              </span>
            </div>
            <span className="cursor-pointer">
              <MdDeleteForever
                color="#ff0110"
                className=" duration-150 transition-all hover:scale-[105%] active:scale-[96%]"
                size={32}
                onClick={() => handleCartDeleteProduct(item._id)}
              />
            </span>
          </div>
        ))}
      </div>
      <div className="right-container min-w-[300px] max-w-xl w-full px-12 md:px-00 md:w-[30%] flex flex-col gap-2 justify-center items-start mt-14">
        <h2 className="font-bold text-green-800 text-lg pb-3 underline">
          Order Summary:{" "}
        </h2>
        <div className="w-full flex justify-between items-center pr-4 font-semibold">
          <span className="text-lg text-green-700 ">Subtotal: </span>
          <span className="text-lg text-green-900">
            {" "}
            ₹{cartItems.reduce((a, b) => a + b.price * b.quantity, 0)}
          </span>
        </div>
        <div className="w-full flex justify-between items-center pr-4 font-semibold">
          <span className="text-lg text-green-700">Delivery : </span>
          <span className="text-lg text-green-900">₹0</span>
        </div>

        <div className="w-full border-b-2 border-green-700 mt-2"></div>

        <div className="w-full flex justify-between items-center pr-4 font-semibold">
          <span className="text-lg text-green-800">Total: </span>
          <span className="text-lg text-green-900">
            {" "}
            ₹{cartItems.reduce((a, b) => a + b.price * b.quantity, 0)}
          </span>
        </div>
        {!user ? (
          <Link
            to="/auth"
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md  duration-150 transition-all hover:scale-[103%] active:scale-[97%]"
          >
            Login
          </Link>
        ) : (
          <Link
            to="/shipping"
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md  duration-150 transition-all hover:scale-[103%] active:scale-[97%]"
          >
            Checkout
          </Link>
        )}
      </div>
    </div>
  );
};

export default Cart;
