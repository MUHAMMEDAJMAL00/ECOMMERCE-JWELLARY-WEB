import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    stocks: "",
    aed: "",
    rating: "",
    category: "",
    image: null,
    weight: "",
    metalPurity: "",
    masterCategory: "",

    availableToOrder: false,
  });

  const [categories, setCategories] = useState([]);
  const [Mastercategories, setMasterCategories] = useState([]);
  const [isTopProduct, setIsTopProduct] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/category")
      .then((res) => setCategories(res.data));
    axios
      .get("http://localhost:3001/mastercategory")
      .then((res) => setMasterCategories(res.data))
      .catch((err) => console.log(err))
      .catch((err) => console.error("Category fetch error", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("stock", formData.stock);
    productData.append("stocks", formData.stocks);
    productData.append("aed", formData.aed);
    productData.append("category", formData.category);
    productData.append("rating", formData.rating);
    productData.append("image", formData.image);
    productData.append("isTopProduct", isTopProduct);
    productData.append("isTrending", isTrending);
    productData.append("weight", formData.weight);
    productData.append("metalPurity", formData.metalPurity);
    productData.append("availableToOrder", formData.availableToOrder);
    productData.append("masterCategory", formData.masterCategory);

    try {
      await axios.post("http://localhost:3001/products", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        stocks: "",
        aed: "",
        rating: "",
        category: "",
        masterCategory: "",
        image: null,
        weight: "",
        metalPurity: "",
        availableToOrder: false,
      });
      setIsTopProduct(false);
      setIsTrending(false);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to add product");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter product description"
            ></textarea>
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter price"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              name="stock"
              type="text"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter available stock"
            />
          </div>

          {/* Stocks */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Stocks
            </label>
            <input
              name="stocks"
              type="text"
              value={formData.stocks}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter stock type (e.g., grams)"
            />
          </div>

          {/* Metal Purity */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Metal Purity
            </label>
            <input
              name="metalPurity"
              type="text"
              value={formData.metalPurity}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., 22K"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Weight
            </label>
            <input
              name="weight"
              type="text"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., 10 grams"
            />
          </div>

          {/* Available to Order */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.availableToOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableToOrder: e.target.checked,
                  })
                }
              />
              <span>Available to Order</span>
            </label>
          </div>

          {/* AED */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Price in AED
            </label>
            <input
              name="aed"
              type="number"
              value={formData.aed}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter AED value"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Rating
            </label>
            <input
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter rating"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Top Product */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isTopProduct}
                onChange={(e) => setIsTopProduct(e.target.checked)}
              />
              <span>Mark as Top Product</span>
            </label>
          </div>

          {/* Trending */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
              />
              <span>Mark as Trending Product</span>
            </label>
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">-- Choose Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <select
            name="masterCategory"
            value={formData.masterCategory}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">-- Choose Master Category --</option>
            {Mastercategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>

          {/* Edit */}
          <div>
            <button
              type="button"
              onClick={() => navigate("/editproduct")}
              className="w-full bg-gray-500 text-white font-semibold py-2 rounded-lg hover:bg-gray-600 mt-2"
            >
              Edit Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
