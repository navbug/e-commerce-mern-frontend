import React, { memo } from "react";
import { Pencil, Plus, Star, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../redux/reducers/cartReducer";
import { calculateAverageRating, numWithCommas } from "../utils/helpers";

const ProductCard = memo(({ product }) => {
  const cartItems = useSelector((state) => state.cart.cartItems);
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

  const avgRating = calculateAverageRating(product.reviews);

  return (
    <div
      onClick={handleCardClick}
      className="group w-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-emerald-200 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 aspect-square overflow-hidden">
        <img
          src={
            product?.images
              ? product?.images
              : "https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png"
          }
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product?.fastDelivery && (
            <div className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-md">
              <Truck size={14} />
              <span>Fast Delivery</span>
            </div>
          )}
          {product.stock > 0 && product.stock < 10 && (
            <div className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-md">
              Only {product.stock} left
            </div>
          )}
        </div>

        {/* Rating Badge */}
        {avgRating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-md">
            <Star className="text-amber-400" size={14} />
            <span className="text-sm font-bold text-gray-800">{avgRating}</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[3rem] group-hover:text-emerald-700 transition-colors">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">
            ₹{numWithCommas(product.price)}
          </span>
        </div>

        {/* Stock Status & Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          {product.stock > 0 ? (
            <>
              {product.stock >= 10 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  In Stock
                </span>
              )}
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="ml-auto flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
              >
                <Pencil size={14} />
                <span>Add to Cart</span>
              </button>
            </>
          ) : (
            <button className="w-full bg-gray-100 text-gray-500 font-semibold py-2.5 rounded-lg cursor-not-allowed border border-gray-200">
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductCard;