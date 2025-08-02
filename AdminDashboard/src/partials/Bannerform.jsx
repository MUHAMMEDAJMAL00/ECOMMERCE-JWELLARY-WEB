import React, { useState } from "react";
import axios from "axios";

const BannerForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // store image as file, not text

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(); // to send text + image
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image); // 'image' should match your backend field name

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/banner`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("ressss", res);

      alert("Banner added successfully!");
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add banner.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Create Banner</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Description</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Upload Image</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          type="submit"
          style={{ marginTop: "20px", padding: "10px 20px" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BannerForm;
