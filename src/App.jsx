import { useState, Suspense, useEffect, lazy, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Register = lazy(() => import("./pages/Register"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Profile = lazy(() => import("./pages/Profile"));
const Cart = lazy(() => import("./pages/Cart"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AddProduct = lazy(() => import("./pages/Admin/AddProduct"));
const EditProduct = lazy(() => import("./pages/Admin/EditProduct"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Checkout = lazy(() => import("./pages/Checkout"));

import Header from "./components/Header";
import MainSpinner from "./components/MainSpinner";
import NotFoundPage from "./pages/NotFoundPage";
import AdminRoute from "./components/AdminRoute";
import { setUser } from "./redux/reducers/userReducer";
import { adminIds } from "./utils/helpers";
import ProtectedRoute from "./components/ProtectedRoute";
import OfflineBanner from "./components/OfflineBanner";
import useOnlineStatus from "./hooks/useOnlineStatus";
import FallbackShimmer from "./components/FallbackShimmer";

function App() {
  //Get user data from Redux store
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const isOnline = useOnlineStatus();

  // Memoizing admin check to avoid recalculation
  const isAdmin = useMemo(() => {
    return user && adminIds.includes(user?._id);
  }, [user]);

  useEffect(() => {
    //Get user data from local storage & set it to Redux store
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      dispatch(setUser(user));
    }
  }, []);

  return (
    <div className="">
      <OfflineBanner isOnline={isOnline} />

      <Header />
      <Suspense fallback={<FallbackShimmer />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth"
            element={
              <ProtectedRoute>
                <AuthPage />
              </ProtectedRoute>
            }
          />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes(Protected) */}
          {isAdmin && (
            <Route
              path="/admin/*"
              element={
                <AdminRoute admin={isAdmin}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                      path="/editProduct/:productId"
                      element={<EditProduct />}
                    />
                    <Route path="/addProduct" element={<AddProduct />} />
                  </Routes>
                </AdminRoute>
              }
            />
          )}
          {/* {user && (
            <Route
              path="/admin/*"
              element={
                <AdminRoute admin={adminIds.includes(user?._id)}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                      path="/editProduct/:productId"
                      element={<EditProduct />}
                    />
                    <Route path="/addProduct" element={<AddProduct />} />
                  </Routes>
                </AdminRoute>
              }
            />
          )} */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </div>
  );
}

export default App;
