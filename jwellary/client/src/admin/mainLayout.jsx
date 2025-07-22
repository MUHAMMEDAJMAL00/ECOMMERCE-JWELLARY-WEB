import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const MainLayout = () => {
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#343a40",
          color: "#fff",
          padding: "20px",
        }}
      >
        <h4>E-Commerce Admin</h4>
        <Nav className="flex-column mt-4">
          <Nav.Link as={Link} to="/admin/home" style={{ color: "#fff" }}>
            Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/products" style={{ color: "#fff" }}>
            Products
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/orders" style={{ color: "#fff" }}>
            Orders
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/users" style={{ color: "#fff" }}>
            Users
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1">
        <Navbar bg="light" className="px-4">
          <Navbar.Brand>Admin Panel</Navbar.Brand>
        </Navbar>

        <div className="p-4">
          <Outlet /> {/* This is where Products, Dashboard, etc. will show */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
