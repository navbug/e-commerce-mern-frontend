import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar";
import ManageProducts from "./ManageProducts";
import ManageCustomers from "./ManageCustomers";
import ManageOrders from "./ManageOrders";

const Dashboard = () => {
  const [currentComponent, setCurrentComponent] = useState('ManageProducts');

  const handleNavigate = (link) => {
    setCurrentComponent(link);
  };

  const renderComponent = () => {
    switch (currentComponent) {
      case 'ManageProducts':
        return <ManageProducts />;
      case 'ManageCustomers':
        return <ManageCustomers />;
      case 'ManageOrders':
        return <ManageOrders />;
      default:
        return null;
    }
  };
  return (
    <div className="flex h-full bg-green-50">
      <DashboardSidebar onNavigate={handleNavigate}/>
      <div className="flex-1 p-4 bg-green-50">{renderComponent()}</div>
    </div>
  );
};

export default Dashboard;
