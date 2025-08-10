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

  return (
    <div>
      <Header />
      <div className="container py-5">
        {item && (
          <div className="card mb-4 shadow-sm">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={`${BASE_URL}/uploads/${item.image}`}
                  alt={item.name}
                  className="img-fluid rounded-start"
                  style={{ objectFit: "cover", height: "100%" }}
                />
              </div>
              <div className="col-md-8 d-flex flex-column justify-content-between">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">
                    <strong>Price:</strong> ₹{item.price}
                  </p>
                  <p className="card-text">
                    <strong>Quantity:</strong> {item.qty}
                  </p>
                </div>
                <div className="card-footer bg-white border-0">
                  <button
                    className="btn btn-outline-danger"
                    onClick={openModal}
                    aria-label="Return Product"
                  >
                    <i className="bi bi-arrow-return-left"></i> Return Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
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
