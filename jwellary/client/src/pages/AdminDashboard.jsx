import React, { useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:3001/api/admin/category",
        { name },
        {
          headers: {
            Authorization: localStorage.getItem("auth"),
          },
        }
      )
      .then((res) => {
        setMessage("Category created successfully");
        setName("");
      })
      .catch((err) => {
        setMessage("Error creating category");
        console.log(err);
      });
  };

  const handle = (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:3001/api/admin/product",
        { name },
        {
          headers: {
            Authorization: localStorage.getItem("auth"),
          },
        }
      )
      .then((res) => {
        setMessage("Category created successfully");
        setName("");
      })
      .catch((err) => {
        setMessage("Error creating category");
        console.log(err);
      });
  };

  return (
    <div className="container mt-5 flex-direction-column">
      <h2>Admin Dashboard - Add Category</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label>Category Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
          />
        </div>
        <button className="btn btn-primary">Add Category</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
      <h2 className="mt-5">Admin Dashboard - Add Products</h2>
      <form onSubmit={handle} className="mt-4">
        <div className="mb-3">
          <label>Product Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
          />
        </div>
        <button className="btn btn-primary">Add Products</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default AdminDashboard;
