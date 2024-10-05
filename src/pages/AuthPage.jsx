import React, { useState } from "react";
import { API_BASE_URL } from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/reducers/userReducer";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const login = (event) => {
    event.preventDefault();
    setLoading(true);
    const requestData = { email, password };
    axios
      .post(`${API_BASE_URL}/login`, requestData)
      .then((result) => {
        if (result.status == 200) {
          setLoading(false);
          localStorage.setItem("token", result.data.result.token);
          localStorage.setItem("user", JSON.stringify(result.data.result.user));

          console.log("****" + result.data.result.user);
          dispatch(setUser(result.data.result.user));

          setLoading(false);
          toast.success(`User successfully logged in`);
          navigate("/");
        }
      })
      .catch((error) => {
        setEmail("");
        setPassword("");
        setLoading(false);
        toast.error(`Error: ${error.message}`);
        console.log("login error", error);
      });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-green-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-6" onSubmit={login}>
            <div>
              <label
                htmlFor="email"
                className="block text-md font-bold leading-6 text-green-900"
              >
                Email address(<span className="text-xs">Demo Email: pagdi@raj.com</span>)
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-md font-bold leading-6 text-green-900"
                >
                  Password(<span className="text-xs">Demo Password: pagdi</span>)
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center items-center rounded-md bg-green-600 px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-md hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 h-10"
              >
                <span>{loading ? <ClipLoader color="#fff" size={18} /> : "Sign In"}</span>
              </button>
            </div>
          </form>

          <div className="my-3 text-center font-bold text-gray-600">OR</div>
          <div className="">
            <button
              onClick={() => navigate("/register")}
              className="w-full px-3 py-1.5 text-md text-green-900  flex justify-center items-center font-semibold leading-6 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 h-10 w-fullgap-2 rounded-md border-green-700 border-2 cursor-pointer group duration-150 hover:bg-green-700 hover:text-white hover:shadow-md hover:scale-105 active:scale-95 mr-2"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
