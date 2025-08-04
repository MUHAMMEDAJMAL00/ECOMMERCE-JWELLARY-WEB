import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";

const AdSectionForm = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", text);
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/adsection`, // ✅ uses env variable
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Upload successful!");
      setText("");
      setImage(null);
    } catch (error) {
      console.error("❌ Upload error:", error);
      setMessage("❌ Upload failed. Please try again.");
    }
  };

  return (
    <Container className="mt-4 w-25 border shadow p-3 rounded">
      <h3 className="mb-3">Submit Text and Image</h3>

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group controlId="textInput" className="mb-3">
          <Form.Label>Text</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter some text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
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

export default AdSectionForm;
