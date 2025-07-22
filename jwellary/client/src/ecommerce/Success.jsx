import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { clearOrder } from "../redux/slices/orderSlice";
import { FaCheckCircle, FaBox, FaHome } from "react-icons/fa";

const ThankYouPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector((state) => state.order.order);
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    if (order) {
      setShowPage(true);
      const timeout = setTimeout(() => {
        dispatch(clearOrder());
      }, 10000);
      return () => clearTimeout(timeout);
    } else {
      navigate("/");
    }
  }, [order, dispatch, navigate]);

  if (!showPage || !order) return null;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          <div className="card shadow-lg p-4">
            <div className="text-center text-success mb-4">
              <FaCheckCircle size={50} />
              <h2 className="mt-2 fw-bold">Thank You for Your Order!</h2>
              <p className="text-muted">
                Your order has been placed successfully.
              </p>
            </div>

            {/* Order Summary */}
            <div className="border-top pt-3">
              <h5 className="fw-semibold">📄 Order Summary</h5>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Total:</strong> ₹
                {parseFloat(order.totalPrice).toFixed(2)}
              </p>
              <p>
                <strong>Payment:</strong> {order.address.paymentMethod}
              </p>
            </div>

            {/* Shipping Address */}
            <div className="border-top pt-3 mt-3">
              <h5 className="fw-semibold">📬 Shipping Address</h5>
              <p>{order.address.fullAddress}</p>
              <p>
                {order.address.city}, {order.address.state},{" "}
                {order.address.country}
              </p>
              <p>
                <strong>Phone:</strong> {order.address.phone}
              </p>
            </div>

            {/* Ordered Items */}
            <div className="border-top pt-3 mt-3">
              <h5 className="fw-semibold">🛍️ Items Ordered</h5>
              <ul className="list-group small">
                {order.items.map((item, index) => (
                  <li key={index} className="list-group-item">
                    {item.name} × {item.qty} — ₹
                    {parseFloat(item.price).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Buttons */}
            <div className="mt-4 d-flex flex-column flex-md-row gap-3">
              <Link to="/orders" className="btn btn-primary w-100">
                <FaBox className="me-2" />
                Track Order
              </Link>
              <Link to="/" className="btn btn-outline-secondary w-100">
                <FaHome className="me-2" />
                Continue Shopping
              </Link>
            </div>

            <p className="text-muted mt-4 small text-center">
              A confirmation email has been sent to your registered email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
