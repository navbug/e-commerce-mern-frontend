import React, { useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { resetCart } from "../redux/reducers/cartReducer";
import { newOrder } from "../api";

const stripeKey = import.meta.env.VITE_STRIPE_KEY;
const stripePromise = loadStripe(stripeKey);

const CheckOutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { shippingInfo, cartItems, subtotal, shippingCharges, total } =
    useSelector((state) => state.cart);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsProcessing(true);

    const orderData = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      shippingCharges,
      total,
      user: user?._id,
    };

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      toast.error(error.message || "Something went wrong");
    }

    if (paymentIntent?.status === "succeeded") {
      await newOrder(orderData);
      dispatch(resetCart());

      toast.success("Payment successful");
      toast.success("Order placed successfully");
      navigate("/");
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Secure Payment
                </h1>
                <p className="text-green-50 mt-1">
                  Complete your order safely
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="px-8 py-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Order Total</span>
              <span className="text-3xl font-bold text-green-700">₹{total}</span>
            </div>
            <p className="text-sm text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your order
            </p>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Payment Element */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <PaymentElement
                options={{
                  layout: "tabs",
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || !stripe}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Pay ₹{total}</span>
                </>
              )}
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

const Checkout = () => {
  const location = useLocation();

  const clientSecret = location.state;

  if (!clientSecret) return <Navigate to={"/shipping"} />;

  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <CheckOutForm />
    </Elements>
  );
};

export default Checkout;