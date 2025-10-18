import React, { useEffect, useRef, useState } from "react";
import { FaPencil, FaPlus, FaStar } from "react-icons/fa6";
import { calculateAverageRating, numWithCommas } from "../utils/helpers";
import { addProductReview, getProductById, getUserById } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShippingFast } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducers/cartReducer";
import moment from "moment";
import MainSpinner from "../components/MainSpinner";
import ProductDetailsShimmer from "../components/ProductDetailsShimmer";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [writeReview, setWriteReview] = useState(false);
  const reviewRef = useRef();

  const { user } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCalcAvgProductRating = (reviews) => {
    return calculateAverageRating(reviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWriteReview(false);
    try {
      const newReview = {
        userId: user._id,
        rating,
        review: reviewRef.current.value,
      };
      await addProductReview(productId, newReview);
      toast.success(`Review added.`);
      getProduct();
      setRating(0);
    } catch (error) {
      toast.error("Error submitting review:", error);
      console.error("Error submitting review:", error);
    }
  };

  const getProduct = async () => {
    try {
      const fetchedProduct = await getProductById(productId);
      setProduct(fetchedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error(`Failed to fetch product`);
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = async (id) => {
    try {
      const { name, avatar } = await getUserById(id);
      if (name && avatar) {
        setUserInfo((prevState) => ({
          ...prevState,
          [id]: [name, avatar],
        }));
      } else {
        setUserInfo((prevState) => ({
          ...prevState,
          [id]: ["Anonymous", "https://via.placeholder.com/150"],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (!cartItems.find((item) => item._id === product._id)) {
      dispatch(addToCart(product));
      toast.success(`Added to cart`);
    } else {
      toast.success(`Already in cart`);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    if (product?.reviews?.length > 0) {
      product?.reviews?.forEach((review) => {
        getUserInfo(review?.user ? review?.user : "anonymous");
      });
    }
  }, [product?.reviews]);

  const avgRating = product ? handleCalcAvgProductRating(product.reviews) : 0;

  return (
    <>
      {loading ? (
        <ProductDetailsShimmer />
      ) : (
        <>
          {product && (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
              {/* Product Details Section */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-12">
                    {/* Image Section */}
                    <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 relative">
                      <img
                        src={
                          product?.images
                            ? product?.images
                            : "https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png"
                        }
                        alt={product?.title}
                        className="max-w-full max-h-[500px] object-contain"
                      />
                      
                      {/* Rating Badge */}
                      {avgRating > 0 && (
                        <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                          <FaStar className="text-amber-400" size={20} />
                          <span className="text-lg font-bold text-gray-800">
                            {avgRating}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info Section */}
                    <div className="flex flex-col gap-6">
                      {/* Title */}
                      <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                          {product?.title}
                        </h1>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product?.fastDelivery && (
                            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-lg border border-emerald-200">
                              <FaShippingFast size={16} />
                              Fast Delivery
                            </span>
                          )}
                          {product?.stock > 0 && (
                            <>
                              {product.stock < 10 ? (
                                <span className="inline-flex items-center bg-red-100 text-red-700 text-sm font-semibold px-3 py-1.5 rounded-lg border border-red-200">
                                  Only {product.stock} left in stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-lg border border-emerald-200">
                                  In Stock
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-gray-900">
                            ₹{numWithCommas(product?.price)}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                          Product Features
                        </h2>
                        <ul className="space-y-2">
                          {product?.desc?.split(".").map((feature, index) => {
                            if (feature.trim()) {
                              return (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-gray-700"
                                >
                                  <span className="text-emerald-600 mt-1">•</span>
                                  <span>{feature.trim()}</span>
                                </li>
                              );
                            }
                            return null;
                          })}
                        </ul>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        {product?.stock > 0 ? (
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
                          >
                            <FaPlus size={18} />
                            <span className="text-lg">Add to Cart</span>
                          </button>
                        ) : (
                          <button className="flex-1 bg-gray-100 text-gray-500 font-semibold py-4 rounded-xl cursor-not-allowed border-2 border-gray-200">
                            Out of Stock
                          </button>
                        )}

                        {user && (
                          <button
                            onClick={() => setWriteReview((prev) => !prev)}
                            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-4 rounded-xl border-2 border-gray-200 hover:border-emerald-300 active:scale-95 transition-all duration-200"
                          >
                            <FaPencil size={16} />
                            <span>Write a Review</span>
                          </button>
                        )}
                      </div>

                      {/* Review Form */}
                      {writeReview && (
                        <div className="bg-white rounded-xl p-6 border-2 border-emerald-200 shadow-lg">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Share Your Experience
                          </h3>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating
                              </label>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((value) => (
                                  <button
                                    type="button"
                                    key={value}
                                    className={`text-3xl cursor-pointer transition-all hover:scale-110 ${
                                      value <= rating
                                        ? "text-amber-400"
                                        : "text-gray-300"
                                    }`}
                                    onClick={() => setRating(value)}
                                  >
                                    <FaStar />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Review
                              </label>
                              <textarea
                                ref={reviewRef}
                                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                rows="4"
                                placeholder="Share your thoughts about this product..."
                              ></textarea>
                            </div>
                            <button
                              type="submit"
                              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
                            >
                              Submit Review
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <FaStar className="text-amber-400" size={28} />
                    Customer Reviews
                  </h2>

                  {product?.reviews?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {product?.reviews?.map((review) => (
                        <div
                          key={review._id}
                          className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {/* User Info */}
                          <div className="flex items-center gap-3 mb-4">
                            <img
                              src={userInfo[review.user]?.[1]}
                              alt={userInfo[review.user]?.[0]}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {userInfo[review.user]?.[0]}
                              </p>
                              <p className="text-xs text-gray-500">
                                {moment(review.createdAt).fromNow()}
                              </p>
                            </div>
                            {/* Rating */}
                            <div className="flex gap-0.5">
                              {[...Array(review.rating)].map((_, index) => (
                                <FaStar
                                  key={index}
                                  className="text-amber-400"
                                  size={16}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Review Text */}
                          <div className="bg-white/60 rounded-lg p-4">
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {review.review}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <FaStar className="text-gray-400" size={32} />
                      </div>
                      <p className="text-lg font-medium text-gray-600">
                        No reviews yet
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Be the first to review this product!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProductDetails;