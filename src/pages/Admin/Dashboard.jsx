import React, { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import ManageProducts from "./ManageProducts";
import ManageCustomers from "./ManageCustomers";
import ManageOrders from "./ManageOrders";

const Dashboard = () => {
  const [currentComponent, setCurrentComponent] = useState("ManageProducts");

  const handleNavigate = (link) => {
    setCurrentComponent(link);
  };

  const renderComponent = () => {
    switch (currentComponent) {
      case "ManageProducts":
        return <ManageProducts />;
      case "ManageCustomers":
        return <ManageCustomers />;
      case "ManageOrders":
        return <ManageOrders />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="flex relative z-10">
        <DashboardSidebar onNavigate={handleNavigate} />
        <div className="flex-1 p-6">{renderComponent()}</div>
      </div>

      <style jsx>{`
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

export default Dashboard;