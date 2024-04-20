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

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [writeReview, setWriteReview] = useState(false);
  const reviewRef = useRef();

  const { user } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCalcAvgProductRating = (reviews) => {
    return calculateAverageRating(reviews);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWriteReview(false);
    try {
      const newReview = { userId: user._id, rating, review: reviewRef.current.value };
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
    }
  };

  const getUserInfo = async (id) => {
    try {
      const { name, avatar } = await getUserById(id);
      if(name && avatar) {
        setUserInfo(prevState => ({
          ...prevState,
          [id]: [ name, avatar ]
        }));
      } else {
        setUserInfo(prevState => ({
          ...prevState,
          [id]: ["Anonymous", "https://via.placeholder.com/150"]
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

  return (
    <>
      {product && (
        <div className="w-full flex flex-col md:flex-row justify-center items-center md:items-start gap-6 md:gap-0 px-4 py-4 bg-green-50">
          <div className="left-container flex justify-center items-center w-full sm:w-[80%] md:w-[60%] lg:w-[40%] h-full bg-green-300 mx-4 rounded-lg shadow-lg">
            <img
              src={
                product?.images
                  ? product?.images
                  : "https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png"
              }
              alt=""
            />
          </div>
          <div className="right-container w-full md:w-[40%] lg:w-[60%] flex flex-col gap-2 relative bg-green-50 pt-2 ml-5 md:ml-0">
            <div className="flex gap-1 text-lg">
              <FaStar color="orange" />
              <span className="text-sm italic font-semibold">{handleCalcAvgProductRating(product.reviews)}</span>
            </div>
            <div className="text-xl font-bold tracking-[0.8px] text-green-950">{product?.title}</div>
            <div className="text-lg font-bold italic text-green-950">
              ₹{` `}{numWithCommas(product?.price)}
            </div>
            {product?.stock > 0 && (
              <div className="">
                {product.stock < 10 ? (
                  <span className="text-red-500 text-sm font-semibold">
                    Only {product.stock} in stock
                  </span>
                ) : (
                  <button className="bg-green-600 text-white text-xs py-1 px-1 rounded">
                    In stock
                  </button>
                )}
              </div>
            )}
            {product?.fastDelivery && (
              <div className="flex gap-1 text-xs italic font-semibold text-green-950">
                <FaShippingFast size={16} /> Fast Delivery
              </div>
            )}
            <div className="mt-2">
              <span className="text-green-900 font-bold">Features:</span>
              <ul className="flex flex-col gap-[6px] text-green-800 font-[500] mt-2">
                {product?.desc?.split(".").map((feature, index) => {
                  return (
                    <li key={index} className="text-sm list-disc max-w-72 md:max-w-64">
                      {feature}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4">
                {product?.stock > 0 ? (
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="bg-green-700 hover:bg-green-800 text-white text-sm font-bold py-1 px-2 rounded flex justify-center items-center gap-1  duration-150 transition-all hover:scale-[103%] active:scale-[97%]"
                  >
                    <FaPlus /> Add to cart
                  </button>
                ) : (
                  <button className="bg-red-500 text-white text-sm font-bold py-2 px-4 rounded w-32">
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
            {user && <div
              className="relative z-10"
            >
              <div className="w-22 h-12 rounded-md relative flex items-center justify-start cursor-pointer">
                <button
                  onClick={() => setWriteReview((prev) => !prev)}
                  className="bg-green-700 hover:bg-green-800 text-white text-sm font-bold py-1 px-2 rounded flex justify-center items-center gap-1  duration-150 transition-all hover:scale-[103%] active:scale-[97%]"
                >
                  <FaPencil /> Write a review
                </button>
              </div>
              {/* dropdown menu */}
              {writeReview && (
                <div className="bg-green-300 p-2 rounded-md shadow-lg shadow-brown mr-2 max-w-52 absolute">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <span
                            key={value}
                            className={`pr-1 text-2xl cursor-pointer ${
                              value <= rating
                                ? "text-yellow-500"
                                : "text-green-100"
                            }`}
                            onClick={() => setRating(value)}
                          >
                            <FaStar />
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mb-2">
                      <textarea
                        id="review"
                        // value={reviewRef.current.value}
                        ref={reviewRef}
                        // onChange={(e) => setReview(e.target.value)}
                        className="w-full border border-green-300 bg-green-50 rounded-md p-1 outline-green-500"
                        rows="2"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-green-700 text-white py-1 px-2 rounded-md hover:bg-green-800  duration-150 transition-all hover:scale-[103%] active:scale-[97%]"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              )}
            </div>}
          </div>
        </div>
      )}
      {product?.reviews?.length > 0 ? (
        <div className="p-4 bg-green-100 pb-4">
          <h2 className="font-bold text-xl underline text-green-900 pb-2">Product Reviews:</h2>
          <div className="flex items-center gap-4 px-4 py-3 flex-wrap h-[220px]">
            {product?.reviews?.map((review, index) => (
              <div key={review._id} className="p-4 bg-green-500 text-white w-[300px] rounded-md">
                <div className="flex items-center justify-end mb-6 relative">
                  <div className="absolute -top-7 -left-7 flex items-center justify-start gap-2">
                    <img src={userInfo[review.user]?.[1]} alt="" className="w-14 rounded-full" />
                    <span className="font-semibold">{userInfo[review.user]?.[0]}</span>
                  </div>
                  <div className="flex justify-center items-center mr-2">
                    {[...Array(review.rating)].map((_, index) => (
                      <span key={index} className="text-yellow-300">
                        <FaStar />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="h-[70px] overflow-auto mb-2">
                  <p className="text-white">{review.review}</p>
                </div>
                <div className="w-full text-gray-100 text-right text-sm">
                  {moment(review.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-green-100">
          <h2 className="font-bold text-xl underline px-4 py-2">Product Reviews:</h2>
        <div className="w-full flex justify-center items-center">
          <span className="text-lg font-semibold text-green-900 text-center">No product reviews yet.</span>
        </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
