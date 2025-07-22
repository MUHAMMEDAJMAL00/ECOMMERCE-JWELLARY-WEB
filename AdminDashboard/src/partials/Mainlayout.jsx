import React from "react";
import Sidebar from "../partials/Sidebar";
import Header from "./Header";
import "../css/style.css";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen ">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Right side: Header + Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header always visible on top */}
        <Header />

        {/* Main content (child routes shown here) */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
