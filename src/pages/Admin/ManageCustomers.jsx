import React, { useEffect, useState } from 'react'
import { deleteUser, getAllUsers } from '../../api';
import { MdDeleteForever } from 'react-icons/md';
import { adminIds } from '../../utils/helpers';
import { toast } from 'react-toastify';
import { setUser } from '../../redux/reducers/userReducer';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const ManageCustomers = () => {
  const [loading, setLoading] = useState(true);
  const {user} = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

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

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      if(id === user._id) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate("/");
      }
      toast.success("User deleted successfully");
      handleGetAllUsers();
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  return (
    <div>
      <div className="main col-span-9 w-full flex-1">
      <h2 className="font-bold my-4 p-2 text-green-900">Manage Customers</h2>
      {loading ? (<div className="flex justify-center items-center">
            <span className="text-green-900 font-bold text-xl"><ClipLoader size={50}/></span>
          </div>) : <table className="w-full max-w-4xl divide-y divide-gray-200">
              {/* head */}
              <thead className="bg-green-300  ">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-bold text-green-800 tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-bold text-green-800 tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-bold text-green-800 tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-bold text-green-800 tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-green-50 divide-y divide-green-700">
                {users?.map((user, index) => {
                  return (
                    <tr
                      key={index}
                      className="cursor-pointer hover:bg-green-200 text-green-800 font-semibold"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12">
                            <img
                              className="w-full h-full rounded-full"
                              src={user.avatar}
                              alt="user image"
                            />
                          </div>
                          <div>
                            <div className="font-bold">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {`${user.email}`}
                      </td>
                      <td className="px-6 py-4">
                        {adminIds.includes(user._id)? "Admin" : "User"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span>
                          <MdDeleteForever
                            color="#ff0110"
                            size={30}
                            onClick={() => handleDeleteUser(user._id)}
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>}
      </div>
    </div>
  )
}

export default ManageCustomers