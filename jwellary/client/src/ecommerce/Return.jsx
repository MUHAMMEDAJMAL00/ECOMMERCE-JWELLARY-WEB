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
  const [reasonType, setReasonType] = useState(""); // radio selection
  const [description, setDescription] = useState(""); // textarea
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setMessage("");
    setReasonType("");
    setDescription("");
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      setMessage("User not logged in.");
      return;
    }
    if (!reasonType) {
      setMessage("Please select a reason.");
      return;
    }
    if (reasonType === "other" && !description.trim()) {
      setMessage("Please enter a description for your return.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/returns`, {
        orderId,
        userId: user._id,
        productId: item?._id,
        reason: reasonType,
        description,
      });

      setMessage("Return request submitted successfully!");
      setReasonType("");
      setDescription("");
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
            <h3 className="fw-bold mb-3">{item.productId.description}</h3>

            <p>
              <strong>Order ID:</strong> {orderId}
            </p>

            <p className="mb-2">
              <strong>Price: </strong>₹{item.price}
            </p>
            <p className="mb-2">
              <strong>Quantity: </strong>
              {item.qty}
            </p>

            <button
              className="btn btn-outline-danger mt-4 py-1 px-3 fs-6"
              onClick={openModal}
              aria-label="Return Product"
              style={{ maxWidth: "150px" }}
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
                    <p>
                      <strong>Order ID:</strong> {orderId}
                    </p>

                    {/* Radio buttons */}
                    <div className="mb-3">
                      <label className="form-label">Select Reason</label>
                      <div className="form-check">
                        <input
                          type="radio"
                          id="damaged"
                          name="reason"
                          value="Damaged Product"
                          checked={reasonType === "Damaged Product"}
                          onChange={(e) => setReasonType(e.target.value)}
                          className="form-check-input"
                          disabled={loading}
                        />
                        <label htmlFor="damaged" className="form-check-label">
                          Damaged Product
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          id="damaged"
                          name="reason"
                          value="Damaged Product"
                          checked={reasonType === "Damaged Product"}
                          onChange={(e) => setReasonType(e.target.value)}
                          className="form-check-input"
                          disabled={loading}
                        />
                        <label htmlFor="damaged" className="form-check-label">
                          Quality is poor
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          id="other"
                          name="reason"
                          value="other"
                          checked={reasonType === "other"}
                          onChange={(e) => setReasonType(e.target.value)}
                          className="form-check-input"
                          disabled={loading}
                        />
                        <label htmlFor="other" className="form-check-label">
                          Other Reason
                        </label>
                      </div>
                    </div>

                    {/* Show textarea only if "Other Reason" selected */}
                    {reasonType === "other" && (
                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                          Description
                        </label>
                        <textarea
                          id="description"
                          className="form-control"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows="4"
                          placeholder="Enter your reason for returning"
                          required
                          disabled={loading}
                        ></textarea>
                      </div>
                    )}

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
