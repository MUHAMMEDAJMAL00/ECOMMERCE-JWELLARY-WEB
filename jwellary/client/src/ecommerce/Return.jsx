import React, { useState } from "react";
import axios from "axios";
import Footer from "../components/footer";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";

const Return = () => {
  const location = useLocation();
  const { orderId, item } = location.state || {};

  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://ecommerce-jwellary-backend.onrender.com/returns",
        {
          orderId,
          productId: item?._id,
          reason,
        }
      );

      console.log("✅ Response from backend:", res.data);
      setMessage("Return request submitted successfully!");
      setReason("");
    } catch (err) {
      console.error("❌ Error submitting return:", err);
      setMessage("Failed to submit return request.");
    }
  };

  return (
    <div>
      <Header />
      <div className="container py-5">
        {item && (
          <div className="card mb-4 shadow-sm">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="img-fluid rounded-start"
                  style={{ objectFit: "cover", height: "100%" }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">
                    <strong>Price:</strong> ₹{item.price}
                  </p>
                  <p className="card-text">
                    <strong>Quantity:</strong> {item.qty}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card shadow p-4">
          <h3 className="text-center mb-4">Return Product</h3>
          <form onSubmit={handleSubmit}>
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
