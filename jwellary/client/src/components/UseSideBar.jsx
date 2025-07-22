import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { clearWishlist } from "../redux/slices/Wishlist";
import { toast } from "react-toastify";

// React Icons
import { FaUserCircle, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";

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
    <div
      className="bg-white border-end  p-3"
      style={{
        width: "240px",
        minHeight: "100vh",
        padding: "0px 0px 0px 80px",
      }}
    >
      <h5 className="mb-4 fw-semibold text-center">Account</h5>
      <hr className="w-75 mx-auto" />

      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <button
            onClick={() => navigate("/myorders")}
            className={`btn w-100 d-flex align-items-center gap-2  ${
              isActive("/myorders")
                ? "fw-bold text-primary shadow px-3"
                : "text-dark"
            }`}
            style={{ background: "none", border: "none" }}
          >
            <FaBoxOpen />
            Orders&Account
          </button>
        </li>

        <li className="nav-item mt-4">
          <button
            onClick={handleLogout}
            className="btn w-100 d-flex align-items-center gap-2 text-danger px-3 shadow"
            style={{ background: "", border: "none" }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;
