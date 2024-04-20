import React, {useState} from "react";
import {FaBars, FaTimes} from "react-icons/fa";

const DashboardSidebar = ({ onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleClick = (link) => {
    onNavigate(link);
  };

  return (
    <div className="relative">
      {/* Mobile Sidebar Toggle Button */}
      <button
        className={`md:hidden block absolute ${isSidebarOpen ? "-top-6" : "top-1"} left-4 z-50 bg-green-900 text-white rounded-md p-2 focus:outline-none`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 md:relative w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="bg-green-700 text-white flex flex-col h-screen p-4">
          <div className="flex items-center justify-center h-20">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleClick("ManageProducts")}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-green-900 focus:outline-none focus:bg-green-900"
                >
                  Manage Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick("ManageCustomers")}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-green-900 focus:outline-none focus:bg-green-900"
                >
                  Manage Customers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick("ManageOrders")}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-green-900 focus:outline-none focus:bg-green-900"
                >
                  Manage Orders
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
