import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { clearWishlist } from "../redux/slices/Wishlist";
import { toast } from "react-toastify";

import { FaBoxOpen, FaSignOutAlt } from "react-icons/fa";

const UserSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishlist());
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop & Tablet Sidebar (≥ 770px) */}
      <div className="user-sidebar d-none d-md-block">
        <h5 className="mb-4 fw-semibold text-center">Account</h5>
        <hr className="w-75 mx-auto" />
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button
              onClick={() => navigate("/myorders")}
              className={`btn w-100 d-flex align-items-center gap-2 ${
                isActive("/myorders")
                  ? "fw-bold text-primary shadow px-3"
                  : "text-dark"
              }`}
              style={{ background: "none", border: "none" }}
            >
              <FaBoxOpen />
              Orders & Account
            </button>
          </li>

          <li className="nav-item mt-4">
            <button
              onClick={handleLogout}
              className="btn w-100 d-flex align-items-center gap-2 text-danger px-3 shadow"
              style={{ background: "none", border: "none" }}
            >
              <FaSignOutAlt /> Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Sidebar (< 770px) */}
      <div className="user-sidebar-mobile d-block d-md-none px-3 py-3 bg-white border shadow-sm rounded">
        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <button
              onClick={() => navigate("/myorders")}
              className={`btn w-100 d-flex align-items-center gap-2 ${
                isActive("/myorders")
                  ? "fw-bold text-primary shadow-sm"
                  : "text-dark"
              }`}
              style={{ background: "#f8f9fa", border: "1px solid #ddd" }}
            >
              <FaBoxOpen />
              Orders & Account
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={handleLogout}
              className="btn w-100 d-flex align-items-center gap-2 text-danger"
              style={{ background: "#f8f9fa", border: "1px solid #ddd" }}
            >
              <FaSignOutAlt /> Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Custom styles for sidebar widths */}
      <style>{`
        @media (min-width: 770px) {
          .user-sidebar {
            background-color: #fff;
            border-right: 1px solid #dee2e6;
            padding: 20px 20px 20px 40px;
            width: 240px;
            min-height: 100vh;
          }
        }

        @media (max-width: 769px) {
          .user-sidebar-mobile {
            margin-bottom: 20px;
            margin-top:100px
          }
        }
      `}</style>
    </>
  );
};

export default UserSidebar;
