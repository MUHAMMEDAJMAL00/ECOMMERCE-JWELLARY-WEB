import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap"; // ✅ Fixed import
// import "bootstrap/dist/css/bootstrap.min.css";

const TopProducts = () => {
  const [title, setTitle] = useState("");
  const [stock, setStock] = useState("");
  const [stocks, setStocks] = useState("");
  const [aedData, setAeddata] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    formData.append("stock", stock);
    formData.append("stocks", stocks);
    formData.append("aed", aedData);

    try {
      const response = await axios.post(
        "http://localhost:3001/topproducts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Upload successful!");
      setTitle("");
      setStock("");
      setStocks("");
      setAeddata("");
      setImage(null);
    } catch (error) {
      console.error("❌ Upload error:", error);
      setMessage("❌ Upload failed. Please try again.");
    }
  };

  return (
    <Container className="mt-4 w-25 border shadow p-3 rounded">
      <h3 className="mb-3">Submit the topproducts</h3>

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group controlId="textInput" className="mb-3">
          <Form.Label>Tiele</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter some title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="textInput" className="mb-3">
          <Form.Label>stock</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter some text"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="textInput" className="mb-3">
          <Form.Label>stocks</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter some text"
            value={stocks}
            onChange={(e) => setStocks(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="textInput" className="mb-3">
          <Form.Label>Aed</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter some text"
            value={aedData}
            onChange={(e) => setAeddata(e.target.value)}
          />
        </Form.Group>

        {/* File Upload */}
        <Form.Group controlId="fileInput" className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>

        {/* Message */}
        {message && (
          <p
            className="mt-3 fw-semibold"
            style={{ color: message.includes("successful") ? "green" : "red" }}
          >
            {message}
          </p>
        )}
      </Form>
    </Container>
  );
};

export default TopProducts;
