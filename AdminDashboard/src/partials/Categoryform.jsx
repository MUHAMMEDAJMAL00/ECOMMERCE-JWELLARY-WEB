import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CategoryForm = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [masterCategories, setMasterCategories] = useState([]);
  const [selectedMasterCategory, setSelectedMasterCategory] = useState("");

  useEffect(() => {
    const fetchMasterCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/mastercategory`
        );
        setMasterCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch master categories", error);
      }
    };

    fetchMasterCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", desc);
    formData.append("image", image);
    formData.append("masterCategoryId", selectedMasterCategory);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Category created successfully!");
      setName("");
      setDesc("");
      setImage(null);
      setSelectedMasterCategory("");
    } catch (err) {
      console.error("Failed to create category", err);
      alert("Failed to create category");
    }
  };

  return (
    <div className="flex justify-center items-center dark:bg-gray-800 h-full bg-white p-8">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl w-full max-w-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Create New Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description:
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows="3"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              required
            ></textarea>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-sm text-gray-500 dark:text-gray-400"
              required
            />
          </div>

          {/* Master Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Master Category:
            </label>
            <select
              value={selectedMasterCategory}
              onChange={(e) => setSelectedMasterCategory(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              required
            >
              <option value="">-- Select Master Category --</option>
              {masterCategories.map((mc) => (
                <option key={mc._id} value={mc._id}>
                  {mc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-md transition"
            >
              Submit
            </button>

            <Link to="/editcategory">
              <button
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-md shadow-md transition"
              >
                Edit
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
