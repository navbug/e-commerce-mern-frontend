import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeQuantity,
  removeFromCart,
  calculatePrice,
} from "../redux/reducers/cartReducer";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="relative text-center">
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-green-600" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="flex-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Shopping Cart
                </h1>
                <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-800 font-semibold">
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          className="w-24 h-24 object-cover rounded-lg shadow-md"
                          src={
                            item?.images ||
                            "https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png"
                          }
                          alt={item.title}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {item.title}
                        </h3>
                        <div className="mt-2">
                          <span className="text-2xl font-bold text-green-700">
                            ₹{item.price}
                          </span>
                          <span className="text-gray-600 ml-2">
                            × {item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white rounded-xl shadow-md p-1">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              handleCartQtyChange(item._id, item.quantity - 1);
                            }
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (item.quantity < item.stock) {
                              handleCartQtyChange(item._id, item.quantity + 1);
                            } else {
                              toast.info(`Item is out of stock`);
                            }
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleCartDeleteProduct(item._id)}
                        className="p-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-96">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-green-100 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">
                    ₹{cartItems.reduce((a, b) => a + b.price * b.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Delivery</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                
                <div className="border-t-2 border-green-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-green-700">
                      ₹{cartItems.reduce((a, b) => a + b.price * b.quantity, 0)}
                    </span>
                  </div>
                </div>
              </div>

              {!user ? (
                <Link
                  to="/auth"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Login to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/shipping"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}

              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 mt-4 border-2 border-green-600 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
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
      `}</style>
    </div>
  );
};

export default Cart;