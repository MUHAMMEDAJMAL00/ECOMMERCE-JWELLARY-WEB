import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MasterCategoryForm = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // ✅ Use API URL from .env
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/mastercategory`, {
        name,
        description: desc,
      });

      alert("✅ Master Category created successfully!");
      setName("");
      setDesc("");
    } catch (err) {
      console.error("❌ Error creating master category:", err);
      alert("❌ Failed to create master category");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 border rounded bg-white shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Create Master Category
      </h2>

      <label className="block mb-2">Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-2 py-1 mb-4 rounded"
        required
      />

      <label className="block mb-2">Description:</label>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full border px-2 py-1 mb-4 rounded"
        rows="3"
        required
      ></textarea>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded w-half"
      >
        Submit
      </button>

      <Link to={"/editmastercategory"} style={{ textDecoration: "none" }}>
        <button
          type="button"
          className="bg-green-600 text-white px-4 py-2 ms-4 rounded w-half"
        >
          Update
        </button>
      </Link>
    </form>
  );
};

export default MasterCategoryForm;
