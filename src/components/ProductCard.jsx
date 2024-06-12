import React from "react";
import { FaHeart, FaPlus, FaRegHeart, FaRegStar, FaStar } from "react-icons/fa6";
import { calculateAverageRating, numWithCommas } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import { FaShippingFast } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducers/cartReducer";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!cartItems.find((item) => item._id === product._id)) {
      dispatch(addToCart(product));
      toast.success(`Added to cart`);
    } else {
      toast.success(`Already in cart`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      key={product.id}
      className="w-full h-[200px] 2xl:h-[300px] rounded-md bg-green-100 overflow-hidden relative mx-2 flex cursor-pointer hover:scale-[102%] duration-150 transition-all"
    >
      <div className="left-container w-[45%] p-2">
        <img
          src={
            product?.images
              ? product?.images
              : "https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png"
          }
          alt=""
          className="w-full h-full object-contain rounded-md"
        />
      </div>
      <div className="w-[55%] right-container flex flex-col items-start gap-1 p-2 bg-green-200 relative ">
        <div className="w-full flex justify-between items-center px-2">
          <div className="flex gap-1">
            {calculateAverageRating(product.reviews) > 0 ? (
              <FaStar color="orange" />
            ) : (
              <FaRegStar color="orange" />
            )}
            <span className="text-sm italic font-semibold">
              {calculateAverageRating(product.reviews)}
            </span>
          </div>
         
        </div>
        <div className="text-lg font-bold">{product.title}</div>
        <div className="text-md font-bold">₹{numWithCommas(product.price)}</div>
        {product.stock > 0 && (
          <div className="">
            {product.stock < 10 ? (
              <span className="text-red-500 text-sm font-semibold">
                Only {product.stock} in stock
              </span>
            ) : (
              <button className="bg-green-800 text-white text-xs py-1 px-1 rounded">
                In stock
              </button>
            )}
          </div>
        )}

        {product?.fastDelivery && (
          <div className="flex gap-1 text-xs italic font-semibold">
            <FaShippingFast size={16} /> Fast Delivery
          </div>
        )}

        <div className="absolute bottom-2 left-2">
          {product.stock > 0 ? (
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className="bg-green-700 hover:bg-green-900 text-white text-sm font-bold py-1 px-2 rounded flex justify-center items-center gap-1 duration-150 transition-all hover:scale-[103%] active:scale-[97%]"
            >
              <FaPlus /> Add to cart
            </button>
          ) : (
            <button className="bg-red-500 text-white text-sm font-bold py-1 px-2 rounded">
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
