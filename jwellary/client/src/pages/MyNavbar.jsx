import { Button } from "bootstrap";
import React from "react";
import { Link } from "react-router-dom";

const MyNavbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-warning px-4 "
      style={{ height: "10vh" }}
    >
      <div className="container-fluid  justify-content-end">
        {/* <Link className="navbar-brand" to="/">
          MyApp
        </Link> */}

        <div className="d-flex">
          <Link
            to="/auth/shop"
            className="nav-link text-light fs-3 me-5 fw-semibold"
          >
            shop now
          </Link>
          <Link
            to="/auth/homee"
            className="  line1 nav-link text-light fs-3   fw-semibold"
          >
            Users
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => {
              localStorage.removeItem("auth");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;
