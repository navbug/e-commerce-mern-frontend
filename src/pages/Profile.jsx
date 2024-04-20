import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="w-full h-[90vh] p-2 flex flex-col gap-4 items-center py-4 bg-green-50">
      <div className="w-full flex justify-between items-center">
        <div className="text-xl font-bold px-4 text-green-900">My Profile</div>
        <div className="flex items-center gap-2 pr-4">
          {/* <Link
            to={"/wishlist"}
            className="  bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded mr-2 flex justify-center items-center text-md  leading-6 shadow-mdgap-2  duration-150 transition-all hover:scale-[103%] active:scale-[97%]"
          >
            Wishlist
          </Link> */}

          <Link
            to={"/orders"}
            className="  bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded mr-2 flex justify-center items-center text-md  leading-6 shadow-mdgap-2  duration-150 transition-all hover:scale-[103%] active:scale-[97%]"
          >
            My Orders
          </Link>
        </div>
      </div>

      <div className="w-[300px] md:w-[400px] lg:w-[500px] flex flex-col bg-green-200 items-center gap-4 mt-6 p-6 rounded-md">
        <div className="w-32 rounded-full">
          <img className="rounded-full" src={user?.avatar} alt="" />
        </div>
        <div>
          <div className="text-xl font-bold px-4 text-green-900">
            {user?.name}
          </div>
        </div>
        <div>
          <div className="text-green-600 font-bold px-4">{user?.email}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
