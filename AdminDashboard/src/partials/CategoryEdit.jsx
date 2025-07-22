import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const CategoryEdit = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [masterCategories, setMasterCategories] = useState([]);
  const [selectedMasterId, setSelectedMasterId] = useState("");

  // ----------------------getting mastercategoriesss
  useEffect(() => {
    axios
      .get("http://localhost:3001/mastercategory")
      .then((res) => setMasterCategories(res.data))
      .catch((err) => console.error("Error fetching master categories", err));
  }, []);

  // ----------------------
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get("http://localhost:3001/category")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("API Error:", err));
  };
  console.log("displaying cat", categories);

  const editCategory = (category) => {
    setSelectedCategory(category);
    setEditName(category.name);
    setEditDesc(category.description);
    setShowModal(true);
    setSelectedMasterId(category.masterCategoryId || "");
  };

  //   ---------------
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3001/category/${selectedCategory._id}`,
        {
          name: editName,
          description: editDesc,
          masterCategoryId: selectedMasterId,
        }
      );
      // Update the frontend list without reloading
      const updated = categories.map((cat) =>
        cat._id === selectedCategory._id ? res.data : cat
      );
      setCategories(updated);
      setShowModal(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };
  // ---------------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3001/category/${id}`);
      // Remove from frontend list
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Table</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                N{" "}
              </th>
              <th className="text-left py-3  uppercase font-semibold text-sm">
                Image
              </th>
              <th className="text-left py-3  uppercase font-semibold text-sm">
                Name
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Description
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Master Category
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                edit
              </th>
              <th className="text-left py-3 px-4  uppercase font-semibold text-sm">
                delete
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat._id} className="border-t">
                <td className="py-3 px-4">{index + 1}</td>
                <td>
                  <img
                    src={cat.image}
                    style={{
                      height: "40px",
                      width: "40px",
                      borderRadius: "50%",
                    }}
                  ></img>
                </td>
                <td className="py-3 px-4">{cat.name}</td>
                <td className="py-3 px-4">{cat.description}</td>
                <td className="py-3 px-4">
                  {cat.masterCategoryId?.name || "—"}
                </td>
                <td className="py-3 px-4">
                  <FiEdit2
                    onClick={() => editCategory(cat)}
                    className="text-blue-600 cursor-pointer"
                  />
                </td>
                <td className="py-3 px-4">
                  <MdDeleteOutline
                    className="text-blue-600  cursor-pointer"
                    onClick={() => handleDelete(cat._id)}
                  />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
            {/* <button>Edit</button> */}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Category</h2>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Category Name"
            />
            <input
              type="text"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Category Description"
            />
            <select
              value={selectedMasterId}
              onChange={(e) => setSelectedMasterId(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            >
              <option value="">Select Master Category</option>
              {masterCategories.map((mc) => (
                <option key={mc._id} value={mc._id}>
                  {mc.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryEdit;
