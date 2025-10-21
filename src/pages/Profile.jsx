import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  ShoppingBag,
  Edit,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { setUser } from "../redux/reducers/userReducer";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-600 text-sm">Manage your account</p>
            </div>
          </div>
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            My Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-green-100 overflow-hidden animate-fade-in-up">
              {/* Profile Header Background */}
              <div className="h-24 bg-gradient-to-r from-green-600 to-emerald-600 relative">
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              {/* Profile Content */}
              <div className="px-6 pb-6 -mt-12 relative">
                {/* Avatar */}
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100">
                    <img
                      className="w-full h-full object-cover"
                      src={user?.avatar}
                      alt={user?.name}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* User Info */}
                <div className="mt-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user?.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <p className="text-sm">{user?.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    dispatch(setUser(null));
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/");
                  }}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-600 text-red-700 font-semibold rounded-xl hover:bg-red-50 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <div
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-green-100 p-6 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-green-600" />
                Account Information
              </h3>

              <div className="space-y-4">
                {/* Name Field */}
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Full Name
                    </p>
                    <p className="text-gray-800 font-semibold truncate">
                      {user?.name}
                    </p>
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Email Address
                    </p>
                    <p className="text-gray-800 font-semibold truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
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

export default Profile;
