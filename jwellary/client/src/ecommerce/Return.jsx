import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../components/footer";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = "https://ecommerce-jwellary-backend.onrender.com";

const Return = () => {
  const { orderId, productId } = useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId || !productId) {
      setMessage("Invalid order or product ID.");
      setLoadingProduct(false);
      return;
    }

    setLoadingProduct(true);
    axios
      .get(`${BASE_URL}/orders/${orderId}`)
      .then((res) => {
        // Assuming res.data.items is an array of products in the order
        const found = res.data.items.find((item) => item._id === productId);
        if (!found) {
          setMessage("Product not found in this order.");
        }
        setProduct(found);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to fetch product details.");
      })
      .finally(() => {
        setLoadingProduct(false);
      });
  }, [orderId, productId]);

  if (loadingProduct) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <p>Loading product info...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <h3>{message || "Product data not available."}</h3>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const totalPrice = (product.price || 0) * (product.qty || 1);

  const openModal = () => {
    setMessage("");
    setReason("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleReturnSubmit = async (e) => {
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
      await axios.post(`${BASE_URL}/returns`, {
        orderId,
        userId: user._id,
        productId: product._id,
        reason,
      });
      setMessage("Return request submitted successfully!");
      setReason("");
      // Optional: close modal after success
      setTimeout(() => {
        setShowModal(false);
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to submit return request."
      );
    }
    setLoading(false);
  };

  return (
    <>
      <Header />

      <div className="container py-5">
        <div className="card shadow-sm">
          {/* Product Image */}
          <img
            src={`${BASE_URL}/uploads/${product.image}`}
            alt={product.name}
            className="card-img-top"
            style={{ objectFit: "cover", height: "400px", width: "100%" }}
          />

          {/* Details */}
          <div className="card-body">
            <h3>{product.name}</h3>
            <p>
              <strong>Price:</strong> ₹{product.price?.toFixed(2)}
            </p>
            <p>
              <strong>Quantity:</strong> {product.qty}
            </p>
            <p>
              <strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}
            </p>

            <button
              className="btn btn-outline-danger"
              onClick={openModal}
              aria-label="Return Product"
              style={{ fontSize: "1.2rem" }}
            >
              <i className="bi bi-arrow-return-left"></i> Return Product
            </button>
          </div>
        </div>
      </div>

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
                ></button>
              </div>
              <form onSubmit={handleReturnSubmit}>
                <div className="modal-body">
                  <p>
                    <strong>Product:</strong> {product.name}
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

      <Footer />
    </>
  );
};

export default Return;
