import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  // ✅ This useEffect runs on page load and fetches protected data
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3001/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data); // Show welcome message or user data
      })
      .catch((err) => {
        console.error(err);
        // Optional: if token is invalid, redirect to login
        // navigate("/login");
      });
  }, []);

  return <div> </div>;
};

export default Home;
