import React, { useState } from "react";
import axios from "axios";

const GoldPriceForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    gold24: "",
    gold22: "",
    gold21: "",
    gold18: "",
    silver: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/goldprice`, formData);
      alert("Gold price added successfully!");
    } catch (error) {
      alert("Failed to post data");
      console.error("Gold price submission failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🪙 Add Gold & Silver Prices
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: "date", label: "Date", type: "date" },
            { name: "gold24", label: "24K Gold (₹)", type: "number" },
            { name: "gold22", label: "22K Gold (₹)", type: "number" },
            { name: "gold21", label: "21K Gold (₹)", type: "number" },
            { name: "gold18", label: "18K Gold (₹)", type: "number" },
            { name: "silver", label: "Silver (₹)", type: "number" },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-gray-700 font-medium mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-lg transition"
          >
            Submit Prices
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoldPriceForm;
