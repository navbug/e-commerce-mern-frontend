import React, { useState } from "react";
import { Menu, X, Package, Users, Receipt, LayoutDashboard, ChevronRight } from "lucide-react";

const DashboardSidebar = ({ onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ManageProducts");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClick = (link) => {
    setActiveTab(link);
    onNavigate(link);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const menuItems = [
    {
      id: "ManageProducts",
      label: "Products",
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: "ManageCustomers",
      label: "Customers",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "ManageOrders",
      label: "Orders",
      icon: <Receipt className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-110 active:scale-95"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-green/80 backdrop-blur-lg border-r border-green-100 shadow-2xl z-40 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 backdrop-blur-sm"></div>
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-green-100 text-sm">Dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:scale-105"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        activeTab === item.id
                          ? "bg-white/20"
                          : "bg-gradient-to-br from-green-100 to-emerald-100 group-hover:from-green-200 group-hover:to-emerald-200"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-base">{item.label}</span>
                  </div>
                  {activeTab === item.id && (
                    <ChevronRight className="w-5 h-5 text-white" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default DashboardSidebar;