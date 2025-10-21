import React, { useEffect, useState } from "react";
import { deleteUser, getAllUsers } from "../../api";
import { adminIds } from "../../utils/helpers";
import { toast } from "react-toastify";
import { setUser } from "../../redux/reducers/userReducer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { Users, Trash2, Shield, User, Mail, Crown } from "lucide-react";

const ManageCustomers = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  console.log(users);
  const handleGetAllUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
      setLoading(false);
    } catch (error) {
      console.log(`Error fetching users: ${error}`);
    }
  };

  const handleDeleteUser = useCallback(async (id) => {
    try {
      await deleteUser(id);
      if (id === user._id) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
      }
      toast.success("User deleted successfully");
      handleGetAllUsers();
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  }, [user?._id]);

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage Customers
            </h1>
            <p className="text-gray-600 text-sm">
              {users?.length || 0} registered users
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <Users className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-600" />
          </div>
          <p className="mt-6 text-green-800 font-semibold text-lg">
            Loading users...
          </p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-green-100 overflow-hidden">
          {/* Users List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-100 to-emerald-100 border-b-2 border-green-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {users?.map((userData, index) => (
                  <tr
                    key={index}
                    className="group hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
                            <img
                              className="w-full h-full object-cover"
                              src={userData.avatar}
                              alt={userData.name}
                              loading="lazy"
                            />
                          </div>
                          {adminIds.includes(userData._id) && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                            {userData.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {userData._id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{userData.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {adminIds.includes(userData._id) ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded-full text-sm font-semibold border border-orange-200">
                          <Crown className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                          <User className="w-3 h-3" />
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteUser(userData._id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-t border-green-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Total: {users?.length || 0} users
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    {users?.filter((u) => adminIds.includes(u._id)).length || 0}{" "}
                    Admins
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    {users?.filter((u) => !adminIds.includes(u._id)).length ||
                      0}{" "}
                    Users
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ManageCustomers;