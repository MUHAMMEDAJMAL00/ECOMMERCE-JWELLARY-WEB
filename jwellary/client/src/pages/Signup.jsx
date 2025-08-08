import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://ecommerce-jwellary-backend.onrender.com";

const Signup = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `${BASE_URL}/register`,
        { name, email, password, age, phone },
        { withCredentials: true }
      )
      .then((result) => {
        console.log("Register success:", result.data);
        navigate("/login");
      })
      .catch((err) => console.error("Register failed:", err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-4 rounded col-10 col-sm-8 col-md-6 col-lg-4 shadow">
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <strong>Name</strong>
            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              className="form-control rounded-0"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <strong>Age</strong>
            <input
              type="number"
              placeholder="Enter Age"
              autoComplete="off"
              className="form-control rounded-0"
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <strong>Phone Number</strong>
            <input
              type="number"
              placeholder="Enter Number"
              autoComplete="off"
              className="form-control rounded-0"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <strong>Email</strong>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <strong>Password</strong>
            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Register
          </button>
        </form>
        <p className="mt-3 text-center">Already have an account?</p>
        <Link
          to={"/login"}
          className="btn btn-outline-secondary w-100 rounded-0"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
