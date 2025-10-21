import React, { useState } from "react";
import { FaCartShopping, FaCircleXmark } from "react-icons/fa6";
import { HiLogout } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setUser } from "../redux/reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { Logo, adminIds } from "../utils/helpers";
import { setSearchKeyword } from "../redux/reducers/productsReducer";
import { Search, User, ShoppingBag, LogIn, LogOut, Settings } from "lucide-react";

const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const [inputActive, setInputActive] = useState(false);
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.user.user);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = cartItems.length;

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
    <div className="sticky top-0 z-50 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 backdrop-blur-lg shadow-lg border-b border-green-100">
      <header className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group transform transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              <img
                src={Logo}
                alt="Shop Kar Logo"
                loading="lazy"
                className="min-w-10 min-h-10 w-10 h-10 rounded-xl relative z-10 shadow-md"
              />
            </div>
            <span className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Shop Kar
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative flex items-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-100">
                <Search className="absolute left-4 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleOnChange}
                  className="flex-1 pl-12 pr-12 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400 rounded-2xl"
                  placeholder="Search products..."
                />
                {inputActive && (
                  <button
                    onClick={() => {
                      setSearchValue("");
                      setInputActive(false);
                      dispatch(setSearchKeyword(""));
                    }}
                    className="absolute right-3 p-1 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <FaCircleXmark className="text-red-500 text-xl" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Cart & User */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95 border border-green-100"
            >
              <ShoppingBag className="h-6 w-6 text-green-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 border border-green-100"
                >
                  <img
                    src={user?.avatar}
                    alt="User Avatar"
                    loading="lazy"
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                </button>

                {/* Dropdown Menu */}
                {open && (
                  <div
                    className="absolute top-16 right-0 w-72 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-100 overflow-hidden animate-fade-in-down"
                    onMouseLeave={() => setOpen(false)}
                  >
                    {/* User Info */}
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
                      <div className="flex items-center gap-4">
                        <img
                          src={user?.avatar}
                          alt="User Avatar"
                          loading="lazy"
                          className="w-16 h-16 object-cover rounded-xl shadow-md"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {user?.name}
                          </h3>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-4 space-y-2">
                      <Link
                        to="/profile"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
                      >
                        <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">My Profile</span>
                      </Link>

                      {adminIds.includes(user?._id) && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
                        >
                          <Settings className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-medium">Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          dispatch(setUser(null));
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");
                          setOpen(false);
                          navigate("/");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group border-t border-gray-100 mt-2"
                      >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  ) : null;
};

export default Header;