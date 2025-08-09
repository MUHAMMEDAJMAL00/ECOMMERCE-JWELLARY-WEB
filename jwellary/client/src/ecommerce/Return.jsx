import React, { useState } from "react";
import axios from "axios";

const Return = () => {
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/returns", {
        orderId,
        reason,
      });

      console.log("✅ Response from backend:", res.data);
      setMessage("Return request submitted successfully!");
    } catch (err) {
      console.error("❌ Error submitting return:", err);
      setMessage("Failed to submit return request.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Return Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Order ID:</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Reason:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Return</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Return;
