import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../redux/reducers/cartReducer";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const Shipping = () => {
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const { cartItems, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(saveShippingInfo(shippingInfo));

    //Get client secret
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payment/create`,
        { amount: total },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.data;
      navigate("/checkout", { state: data.clientSecret });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (cartItems.length <= 0) return navigate("/cart");
  }, [cartItems]);

  return (
    <div className="w-full h-[90vh] flex justify-center items-center bg-green-50 pt-6">

      <form
        onSubmit={handleSubmit}
        className="w-[500px] h-full flex flex-col items-start justify-start"
      >
        <h1 className="text-green-800 font-bold text-xl pb-6 underline">
          Enter Shipping Address:
        </h1>

        <input
          name="address"
          value={shippingInfo.address}
          onChange={handleOnChange}
          type="text"
          placeholder="Address"
          required
          className="block w-[400px] rounded-md border-0 py-1.5 text-green-950 shadow-md ring-1 ring-inset ring-green-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bold-600 sm:text-md sm:leading-6 mb-5"
        />

        <input
          name="city"
          value={shippingInfo.addrecityss}
          onChange={handleOnChange}
          type="text"
          placeholder="City"
          required
          className="block w-[200px] rounded-md border-0 py-1.5 text-green-950 shadow-md ring-1 ring-inset ring-green-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bold-600 sm:text-md sm:leading-6 mb-5"
        />

        <input
          name="state"
          value={shippingInfo.state}
          onChange={handleOnChange}
          type="text"
          placeholder="State"
          required
          className="block w-[200px] rounded-md border-0 py-1.5 text-green-950 shadow-md ring-1 ring-inset ring-green-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bold-600 sm:text-md sm:leading-6 mb-5"
        />

        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={handleOnChange}
          className="block w-[200px] rounded-md border-0 py-1.5 text-green-950 shadow-md ring-1 ring-inset ring-green-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bold-600 sm:text-md sm:leading-6 mb-5"
        >
          <option value="">Choose Country</option>
          <option value="india">India</option>
        </select>

        <input
          required
          type="number"
          placeholder="Pincode"
          name="pincode"
          value={shippingInfo.pincode}
          onChange={handleOnChange}
          className="block w-[200px] rounded-md border-0 py-1.5 text-green-950 shadow-md ring-1 ring-inset ring-green-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bold-600 sm:text-md sm:leading-6 mb-5"
        />

        <button type="submit" className="flex w-[170px] justify-center items-center rounded-md bg-green-600 px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-md duration-150 hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 gap-2 ">Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
