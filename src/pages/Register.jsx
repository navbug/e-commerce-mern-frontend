import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaUpload } from "react-icons/fa6";

const Register = () => {
  const [image, setImage] = useState({ preview: "", data: "" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    event.preventDefault();
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
    console.log(img);
    setImage(img);
  };

  const handleFileUpload = async (e) => {
    let formData = new FormData();
    formData.append("file", image.data);

    const res = await axios.post(`${API_BASE_URL}/uploadFile`, formData);
    console.log(res);
    return res;
  };

  const registerUser = async (event) => {
    event.preventDefault();

    setLoading(true);
    const imgRes = await handleFileUpload();

    const requestData = { name, email, password, avatar: `${API_BASE_URL}/files/${imgRes.data.fileName}` };
    axios
      .post(`${API_BASE_URL}/register`, requestData)
      .then((result) => {
        if (result.status == 201) {
          setLoading(false);
          toast.success(`User successfully registered`);
          console.log("login success", result.data);
        }
        setName("");
        setEmail("");
        setPassword("");

        navigate("/auth");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(`Error: ${error.message}`);
        console.log("login error", error);
      });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-3 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-green-900">
            Register your account
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-4" onSubmit={registerUser}>
          <div className="w-full flex items-center justify-center">
              <div className="w-[50%] bg-gray-100 backdrop-blur-md h-[150px] lg:h-[210px] 2xl:h-[220px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
                {!image.data ? (
                  <label className="w-full cursor-pointer h-full">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="flex items-center justify-center cursor-pointer flex-col gap-2">
                        <FaUpload className="text-2xl" />
                        <p className="text-lg text-txtLight">Choose Profile</p>
                      </div>
                    </div>

                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={image.preview}
                      className="w-full h-full object-contain rounded-md"
                      loading="lazy"
                      alt="profile image"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block font-bold leading-6 text-green-900"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="enter fullname"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-md font-bold leading-6 text-green-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  placeholder="enter email id"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bold-600 sm:text-md sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-md font-bold leading-6 text-green-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="enter your password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`flex w-full justify-center items-center rounded-md bg-green-600 px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-md duration-150 hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 gap-2 ${loading && "bg-green-700"}`}
              >
                <span>{loading ? <ClipLoader color="#fff" size={18} /> : "Register"}</span>
              </button>
            </div>
          </form>

          <div className="my-3 text-center font-bold text-gray-600">OR</div>
          <div className="">
              <button
                onClick={() => navigate("/auth")}
                className="w-full px-3 py-1.5 text-md text-green-900  flex justify-center items-center font-semibold leading-6 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 h-10 w-fullgap-2 rounded-md border-green-700 border-2 cursor-pointer group duration-150 hover:bg-green-700 hover:text-white hover:shadow-md hover:scale-105 active:scale-95 mr-2"
              >
                Login
              </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default Register;
