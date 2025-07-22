import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(""); // ✅ new
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3001/register",
        { name, email, password, age, phone }, // ✅ send age too
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
      <div className="bg-white p-3 rounded w-25">
        <h2>Register</h2>
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
              type="text"
              placeholder="Enter Age"
              autoComplete="off"
              className="form-control rounded-0"
              onChange={(e) => setAge(e.target.value)} // ✅ new
            />
          </div>
          <div className="mb-3">
            <strong>Phone Number</strong>
            <input
              type="number"
              placeholder="Enter Number"
              autoComplete="off"
              className="form-control rounded-0"
              onChange={(e) => setPhone(e.target.value)} // ✅ new
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
        <p className="mt-2">Already have an account?</p>
        <Link
          to={"/login"}
          className="btn btn-default border w-100 bg-light rounded-0"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
