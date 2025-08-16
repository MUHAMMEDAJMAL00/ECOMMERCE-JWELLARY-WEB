import React, { useState } from "react";
import axios from "axios";
import Footer from "../components/footer";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const BASE_URL = "https://ecommerce-jwellary-backend.onrender.com";

const Return = () => {
  const location = useLocation();
  const { orderId, item } = location.state || {};

  const { user } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setMessage("");
    setReason("");
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      setMessage("User not logged in.");
      return;
    }
    if (!reason.trim()) {
      setMessage("Please enter a reason.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/returns`, {
        orderId,
        userId: user._id,
        productId: item?._id,
        reason,
      });
      setMessage("Return request submitted successfully!");
      setReason("");
      setTimeout(() => {
        closeModal();
        setMessage("");
      }, 2000);
    } catch (err) {
      console.error("❌ Error submitting return:", err.response?.data || err);
      setMessage("Failed to submit return request.");
    }

    setLoading(false);
  };

  if (!item) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <h3>Product data not available.</h3>
          <button
            className="btn btn-primary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div>
      <Header />
      <div className="container py-5 pt-5 mt-5">
        <div
          className="row mx-auto p-3 shadow rounded"
          style={{ maxWidth: "900px", backgroundColor: "#fff" }}
        >
          {/* Left side - product image */}
          <div className="col-md-5 text-center mb-4">
            <img
              src={`${BASE_URL}/uploads/${item.image}`}
              alt={item.name}
              className="rounded"
              style={{
                objectFit: "cover",
                width: "100%",
                maxHeight: "460px",
                maxWidth: "460px",
              }}
            />
          </div>

          {/* Right side - product details */}
          <div className="col-md-7 d-flex flex-column justify-content-center px-4">
            <h2 className="fw-bold mb-3">{item.name}</h2>

            {/* You can add more details here if available */}
            <p className="mb-2">
              <strong> </strong>₹{item.description}
            </p>
            <p className="mb-2">
              <strong>Price: </strong>₹{item.price}
            </p>
            <p className="mb-2">
              <strong>Quantity: </strong>
              {item.qty}
            </p>

            {/* Return button */}
            <button
              className="btn btn-outline-danger mt-4 py-1 px-3 fs-6" // smaller padding and font size
              onClick={openModal}
              aria-label="Return Product"
              style={{ maxWidth: "150px" }} // smaller width
            >
              <i className="bi bi-arrow-return-left me-2"></i> Return
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="modal fade show d-flex align-items-center justify-content-center"
            style={{
              display: "flex",
              backgroundColor: "rgba(0,0,0,0.5)",
              minHeight: "100vh",
              padding: "1rem",
            }}
            tabIndex="-1"
            aria-modal="true"
            role="dialog"
            onClick={closeModal}
          >
            <div
              className="modal-dialog"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Return Product</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={closeModal}
                    disabled={loading}
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <p>
                      <strong>Product:</strong> {item.name}
                    </p>
                    <div className="mb-3">
                      <label htmlFor="reason" className="form-label">
                        Reason for Return
                      </label>
                      <textarea
                        id="reason"
                        className="form-control"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows="4"
                        placeholder="Enter your reason for returning"
                        required
                        disabled={loading}
                      ></textarea>
                    </div>
                    {message && (
                      <div
                        className={`alert ${
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
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Return"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Return;
