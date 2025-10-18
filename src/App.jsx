import { Suspense, useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AddProduct,
  AuthPage,
  Cart,
  Dashboard,
  EditProduct,
  HomePage,
  NotFoundPage,
  OrderDetails,
  Orders,
  ProductDetails,
  Profile,
  Register,
} from "./pages";
import MainSpinner from "./components/MainSpinner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/reducers/userReducer";
import AdminRoute from "./components/AdminRoute";
import { adminIds } from "./utils/helpers";
import Shipping from "./pages/Shipping";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import OfflineBanner from "./components/OfflineBanner";
import useOnlineStatus from "./hooks/useOnlineStatus";

function App() {
  //Get user data from Redux store
  const {user} = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Custom hook to track online/offline status
  const isOnline = useOnlineStatus();

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
      <Suspense fallback={<MainSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
          <Route path="/auth" element={<ProtectedRoute><AuthPage /></ProtectedRoute>} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes(Protected) */}
          {user && (
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
          )}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </div>
  );
}

export default App;
