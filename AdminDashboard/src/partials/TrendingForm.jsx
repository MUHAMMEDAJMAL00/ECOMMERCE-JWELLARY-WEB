import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";

const Trending = () => {
  const [title, setTitle] = useState("");
  const [stock, setStock] = useState("");
  const [stocks, setStocks] = useState("");
  const [rating, setRating] = useState("");
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
    formData.append("rating", rating);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/trending`, // ✅ dynamic URL
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
      setRating("");
      setImage(null);
    } catch (error) {
      console.error("❌ Upload error:", error);
      setMessage("❌ Upload failed. Please try again.");
    }
  };

  return (
    <Container className="mt-4 w-25 border shadow p-3 rounded">
      <h3 className="mb-3">Trending</h3>

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group controlId="titleInput" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="stockInput" className="mb-3">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="stocksInput" className="mb-3">
          <Form.Label>Stocks</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter stocks"
            value={stocks}
            onChange={(e) => setStocks(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="aedInput" className="mb-3">
          <Form.Label>AED</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter AED"
            value={aedData}
            onChange={(e) => setAeddata(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="ratingInput" className="mb-3">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="fileInput" className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>

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

export default Trending;
