import React, { useState } from "react";
import axios from "axios";
import Footer from "../components/footer";
import Header from "../components/Header";

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
      setOrderId("");
      setReason("");
    } catch (err) {
      console.error("❌ Error submitting return:", err);
      setMessage("Failed to submit return request.");
    }
  };

  return (
    <div>
      <Header />
      <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div
          className="card shadow p-4"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <h3 className="text-center mb-4">Return Product</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Order ID</label>
              <input
                type="text"
                className="form-control"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your Order ID"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Reason for Return</label>
              <textarea
                className="form-control"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter your reason for returning"
                rows="4"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Submit Return
            </button>
          </form>

          {message && (
            <div
              className={`alert mt-3 ${
                message.includes("successfully")
                  ? "alert-success"
                  : "alert-danger"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Return;
