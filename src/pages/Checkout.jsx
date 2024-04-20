import React, { useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetCart } from '../redux/reducers/cartReducer';
import { toast } from 'react-toastify';
import { newOrder } from '../api';

const stripeKey = import.meta.env.VITE_STRIPE_KEY;
const stripePromise = loadStripe(stripeKey);

const CheckOutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { shippingInfo, cartItems, subtotal, shippingCharges, total } = useSelector((state) => state.cart);

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
    }

    const {paymentIntent, error} = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if(error) {
      setIsProcessing(false);
      toast.error(error.message || "Something went wrong");
    }

    if (paymentIntent?.status === "succeeded") {
      await newOrder(orderData);
      dispatch(resetCart());

      toast.success("Payment successful");
      toast.success("Order placed successfully");
      navigate("/orders");
    }
    setIsProcessing(false);
  };

  return (
    <div className="checkout-container w-full h-[90vh] bg-green-50 justify-center p-6">
      <form onSubmit={handleSubmit} className='bg-green-50 w-[620px] h-[250px]'>
        <PaymentElement  className='bg-green-500 px-6 py-2 rounded-md text-white font-bold'/>
        <button className='flex w-[100px] justify-center items-center mt-4 rounded-md bg-green-600 px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-md hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 gap-2  duration-150 transition-all hover:scale-[103%] active:scale-[97%]' type="submit" disabled={isProcessing}>
          {isProcessing? 'Processing...' : 'Pay'}
        </button>
      </form>
    </div>
  );
}

const Checkout = () => {
  const location = useLocation();

  const clientSecret = location.state;

  if(!clientSecret) return <Navigate to={"/shipping"} />

  return (
    <Elements options={{clientSecret}} stripe={stripePromise}>
      <CheckOutForm />
    </Elements>
  )
}

export default Checkout