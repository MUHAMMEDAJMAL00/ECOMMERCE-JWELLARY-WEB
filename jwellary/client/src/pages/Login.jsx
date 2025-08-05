import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../redux/slices/authSlice";

const BASE_URL = "https://ecommerce-jwellary-backend.onrender.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });

      const userId = result?.data?.user?._id;
      localStorage.setItem("userId", userId);

      dispatch(login({ user: result.data.user, token: result.data.token }));
      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      const msg = error?.response?.data?.message || "Invalid email or password";
      toast.error(msg);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row justify-content-center w-100">
        <div className="col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3">
          <div className="bg-white p-4 rounded shadow-sm">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100 mb-2">
                Login
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => navigate("/signup")}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
