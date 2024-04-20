import React, { useState } from "react";
import {
  FaHeart,
  FaCartShopping,
  FaAngleRight,
  FaCircleXmark,
} from "react-icons/fa6";
import { HiLogout } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setUser } from "../redux/reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { Logo, adminIds } from "../utils/helpers";
import { setSearchKeyword } from "../redux/reducers/productsReducer";

const Header = () => {
  //Component states
  const [searchValue, setSearchValue] = useState("");
  const [inputActive, setInputActive] = useState(false);
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.user.user);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = cartItems.length;

  // Check if the current location is /auth or /register
  const shouldRenderHeader = !["/auth", "/register"].includes(
    location.pathname
  );

  const handleOnChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value) {
      setInputActive(true);
    } else {
      setInputActive(false);
    }
    dispatch(setSearchKeyword(e.target.value));
  };

  return shouldRenderHeader ? (
    <div className="container-header bg-green-100">
      <header className="w-full h-12 max-w-[1300px] m-auto bg-green-100 flex justify-between items-center gap-4 py-3 px-4 pt-2">
        {/* Logo section */}
        <Link to={`/`} className="left-container flex items-center gap-2">
          <img src={Logo} alt="" className="w-10 rounded-md" loading="lazy" />
          <span className="logo_text text-xl font-semibold text-green-800">
            Shop Kar
          </span>
        </Link>

        {/* Search section  */}
        <div className="hidden lg:flex center-container flex-1 bg-green-100 rounded-full duration-150 hover:scale-105 active:scale-105 mx-4 relative">
          <input
            type="text"
            value={searchValue}
            onChange={handleOnChange}
            className="flex-1 rounded-full text-md"
            placeholder="Type product names to search ..."
          />
          {inputActive && (
            <span
              onClick={() => {
                setSearchValue("");
                setInputActive(false);
                dispatch(setSearchKeyword(""));
              }}
              className="absolute right-3 top-1 cursor-pointer"
            >
              <FaCircleXmark size={28} />
            </span>
          )}
        </div>

        {/* Cart & User section */}
        <div className="right-container flex items-center gap-4">
          {/* <Link
            to={"/wishlist"}
            className="text-2xl duration-150 hover:scale-110 active:scale-95"
          >
            <FaHeart color="green" className="" />
          </Link> */}
          <div className="relative">
            <Link to={"/cart"} className="cursor-pointer">
              <FaCartShopping className="text-2xl text-green-800 duration-150 hover:scale-110 active:scale-95" />
              {/* Render badge only if there are items in the cart */}
              {totalItems > 0 && (
                <span className="absolute -top-1 right-1 inline-flex items-center justify-center w-3 h-3 bg-green-500 text-white text-[10px] font-bold rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {user ? (
            <div onClick={() => setOpen(!open)} className="relative z-10">
              <div className="w-9 h-9 rounded-md relative flex items-center justify-center cursor-pointer">
                <img
                  src={user?.avatar}
                  alt=""
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              {/* dropdown menu */}
              {open && (
                <div
                  className="absolute top-11 right-1 flex flex-col items-center w-60 p-4 border border-green-200 shadow-xl shadow-green-200 bg-green-50 rounded-md pt-4 gap-2"
                  onMouseLeave={() => setOpen(false)}
                >
                  {user?.avatar && (
                    <div className="w-20 h-20 rounded-md relative flex items-center justify-center cursor-pointer">
                      <img
                        src={user?.avatar}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  )}

                  {/* menus */}
                  <div className="w-full flex flex-col items-start gap-4 pt-4">
                    <Link
                      to="/profile"
                      className="text-txtLight hover:text-txtDark text-base whitespace-nowrap text-green-700 font-semibold"
                    >
                      My Profile
                    </Link>

                    {adminIds.includes(user?._id) && (
                      <Link
                        to="/admin/dashboard"
                        className="text-txtLight hover:text-txtDark text-base whitespace-nowrap text-green-700 font-semibold"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <div
                      onClick={() => {
                        dispatch(setUser(null));
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/");
                      }}
                      className="w-full p-2 border-t border-gray-300 flex justify-between items-center group cursor-pointer text-green-800 font-semibold"
                    >
                      <p className="group-hover:text-txtDark text-txtLight">
                        Sign Out
                      </p>
                      <HiLogout className="text-txtLight group-hover:text-txtDark" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={`/auth`}
              className="w-full flex justify-between items-center gap-2 px-2 py-1 rounded-md border-green-700 border-2 cursor-pointer group duration-150 hover:bg-green-700 hover:shadow-md hover:scale-105 active:scale-95 mr-2"
            >
              <p className="text-green-900 text-md group-hover:text-white">
                Login
              </p>
              <FaAngleRight className="text-green-900 text-base group-hover:text-white" />
            </Link>
          )}
        </div>
      </header>

      {/* Search responsive design  */}
      <div className="flex lg:hidden w-full h-11 max-w-[1300px] m-auto bg-green-100 justify-center items-center gap-4 px-3 mr-12">
        {/* Search section  */}
        <div className="flex center-container flex-1 bg-green-100 rounded-full w-full max-w-xl duration-150 hover:scale-105 active:scale-105 relative">
          <input
            type="text"
            value={searchValue}
            onChange={handleOnChange}
            className="flex-1 rounded-full text-md pb-2"
            placeholder="Type product names to search ..."
          />
          {inputActive && (
            <span
              onClick={() => {
                setSearchValue("");
                setInputActive(false);
                dispatch(setSearchKeyword(""));
              }}
              className="absolute right-3 top-1 cursor-pointer"
            >
              <FaCircleXmark size={28} />
            </span>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Header;
