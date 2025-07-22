import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

const EditProduct = () => {
  const [productsdata, setProductsdata] = useState([]);
  const [categories, setCategories] = useState([]);
  const [Mastercategories, setMasterCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, masterCategoryRes] =
          await Promise.all([
            axios.get("http://localhost:3001/products"),
            axios.get("http://localhost:3001/category"),
            axios.get("http://localhost:3001/mastercategory"),
          ]);
        setProductsdata(productsRes.data);
        setCategories(categoriesRes.data);
        setMasterCategories(masterCategoryRes.data);
      } catch (err) {
        console.log("Error fetching data", err);
      }
    };
    fetchData();
  }, []);
  console.log("master", Mastercategories);
  const getCategoryName = (categoryField) => {
    if (typeof categoryField === "object" && categoryField !== null) {
      return categoryField.name || "Unknown Category";
    }
    const found = categories.find((cat) => cat._id === categoryField);
    return found ? found.name : "Unknown Category";
  };

  const getCategoryImage = (categoryField) => {
    if (typeof categoryField === "object" && categoryField !== null) {
      return categoryField.image || null;
    }
    const found = categories.find((cat) => cat._id === categoryField);
    return found ? found.image : null;
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setSelectedProduct((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setImageFile(files[0]);
    } else {
      setSelectedProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setImageFile(null);
    setShowModal(false);
  };

  const handleUpdateProduct = async () => {
    const formData = new FormData();
    const fields = [
      "name",
      "description",
      "price",
      "stock",
      "stocks",
      "aed",
      "rating",
      "weight",
      "metalPurity",
      "availableToOrder",
      "isTopProduct",
      "isTrending",
    ];

    fields.forEach((field) => {
      formData.append(field, selectedProduct[field] || "");
    });
    console.log("Selected Category:", selectedProduct.category);

    formData.append(
      "Category",
      typeof selectedProduct.category === "object"
        ? selectedProduct.category._id
        : selectedProduct.category
    );

    formData.append(
      "masterCategory",
      typeof selectedProduct.masterCategory === "object"
        ? selectedProduct.masterCategory._id
        : selectedProduct.masterCategory
    );

    if (imageFile) formData.append("image", imageFile);

    try {
      await axios.put(
        `http://localhost:3001/products/${selectedProduct._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Product updated successfully");
      const updated = await axios.get("http://localhost:3001/products");
      setProductsdata(updated.data);
      handleCloseModal();
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">All Products</h2>
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border ">Product</th>
            {/* <th className="border px-4 py-2">Description</th> */}
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Category Image</th>
            <th className="border px-4 py-2">Edit</th>
          </tr>
        </thead>
        <tbody>
          {productsdata.map((product) => (
            <tr key={product._id}>
              <td className="border">{product.name}</td>
              {/* <td className="border px-4 py-2">{product.description}</td> */}
              <td className="border px-4 py-2">
                {getCategoryName(product.category)}
              </td>
              <td className="border px-4 py-2">
                {getCategoryImage(product.category) ? (
                  <img
                    src={getCategoryImage(product.category)}
                    alt="Category"
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                    No Image
                  </div>
                )}
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-blue-600"
                >
                  <FiEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-light bg-opacity-60 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6">
              Edit Product - {selectedProduct.name}
            </h3>
            <form className="space-y-4">
              {/* Input Fields */}
              <input
                name="name"
                value={selectedProduct.name}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                placeholder="Name"
              />
              <textarea
                name="description"
                value={selectedProduct.description}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                placeholder="Description"
              />
              <input
                name="price"
                value={selectedProduct.price}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                placeholder="Price"
              />
              <input
                name="stock"
                value={selectedProduct.stock}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                placeholder="Stock"
              />
              <input
                name="stocks"
                value={selectedProduct.stocks}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                placeholder="Stocks"
              />
              <input
                name="aed"
                value={selectedProduct.aed}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                placeholder="AED"
              />
              <input
                name="rating"
                value={selectedProduct.rating}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                placeholder="Rating"
              />
              <input
                name="weight"
                value={selectedProduct.weight}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                placeholder="Weight"
              />
              <input
                name="metalPurity"
                value={selectedProduct.metalPurity}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                placeholder="Metal Purity"
              />

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="availableToOrder"
                    checked={selectedProduct.availableToOrder || false}
                    onChange={handleChange}
                  />
                  <span>Available To Order</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isTopProduct"
                    checked={selectedProduct.isTopProduct || false}
                    onChange={handleChange}
                  />
                  <span>Top Product</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isTrending"
                    checked={selectedProduct.isTrending || false}
                    onChange={handleChange}
                  />
                  <span>Trending</span>
                </label>
              </div>

              {/* Category */}
              <select
                name="category"
                value={
                  typeof selectedProduct.category === "object"
                    ? selectedProduct.category._id
                    : selectedProduct.category
                }
                onChange={handleChange}
                className="w-full p-3 border rounded"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                name="masterCategory"
                value={
                  typeof selectedProduct.masterCategory === "object"
                    ? selectedProduct.masterCategory._id
                    : selectedProduct.masterCategory || ""
                }
                onChange={handleChange}
                className="w-full p-3 border rounded"
              >
                <option value="">-- Select Master Category --</option>
                {Mastercategories.map((mc) => (
                  <option key={mc._id} value={mc._id}>
                    {mc.name}
                  </option>
                ))}
              </select>

              {/* Image Upload */}
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleUpdateProduct}
                  className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
