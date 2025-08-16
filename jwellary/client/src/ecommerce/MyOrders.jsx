import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/footer";
import UserSideBar from "../components/UseSideBar";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import { updateUserInfo } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const BASE_URL = "https://ecommerce-jwellary-backend.onrender.com";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?._id) {
          const [orderRes, userRes] = await Promise.all([
            axios.get(`${BASE_URL}/orders/${user._id}`),
            axios.get(`${BASE_URL}/users/${user._id}`),
          ]);
          setOrders(orderRes.data || []);
          setUserDetails(userRes.data);
          setFormData({
            name: userRes.data.name,
            email: userRes.data.email,
            phone: userRes.data.phone,
            age: userRes.data.age,
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);
  console.log("getting orders", orders);

  const handleEditClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/updateUser/${user._id}`, formData);
      setUserDetails((prev) => ({ ...prev, ...formData }));
      dispatch(updateUserInfo(formData));
      setShowModal(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleViewProduct = (orderId, item) => {
    console.log("📦 handleViewProduct called with:", { orderId, item });
    navigate("/return", {
      state: { orderId, item },
    });
  };

  return (
    <>
      <Header />
      <div className="container py-4">
        <div className="row">
          {/* Sidebar */}
          <aside className="col-lg-3 col-md-4 mb-4">
            <div
              className="d-none d-lg-block position-sticky"
              style={{ top: "90px" }}
            >
              <UserSideBar />
            </div>
            <div className="d-block d-lg-none">
              <UserSideBar />
            </div>
          </aside>

          {/* Orders Section */}
          <main className="col-lg-9 col-md-8">
            <section className="mb-4">
              <h3 className="fw-bold">My Account</h3>
              <hr />
              <div
                className="text-end text-warning fw-bold mb-3"
                style={{ cursor: "pointer" }}
                onClick={handleEditClick}
              >
                Edit Profile
              </div>

              {userDetails && (
                <div className="bg-light rounded p-4 shadow-sm mb-5">
                  <div className="mb-2">
                    <strong>Name:</strong>{" "}
                    <span className="text-muted">{userDetails.name}</span>
                  </div>
                  <div className="mb-2">
                    <strong>Email:</strong>{" "}
                    <span className="text-muted">{userDetails.email}</span>
                  </div>
                  <div className="mb-2">
                    <strong>Phone Number:</strong>{" "}
                    <span className="text-muted">{userDetails.phone}</span>
                  </div>
                  <div>
                    <strong>Age:</strong>{" "}
                    <span className="text-muted">{userDetails.age || "—"}</span>
                  </div>
                </div>
              )}
            </section>

            <section className="card shadow-sm rounded">
              <div className="card-body">
                <h4 className="card-title mb-4">My Orders</h4>

                {loading ? (
                  <p className="text-muted">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-muted">No orders found.</p>
                ) : (
                  <>
                    {/* Desktop: One card per order with multiple items inside */}
                    <div className="d-none d-md-block">
                      {orders.map((order, idx) => (
                        <div
                          key={order._id}
                          className="card mb-4 shadow-sm"
                          style={{ borderRadius: 12 }}
                        >
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <div>
                              <strong>Order #{idx + 1}</strong>{" "}
                              <small className="text-muted">
                                -{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                            <Badge
                              bg={
                                order.status === "Delivered"
                                  ? "success"
                                  : order.status === "Processing"
                                  ? "warning"
                                  : "secondary"
                              }
                              className="text-uppercase"
                              style={{ fontSize: "0.9rem" }}
                            >
                              {order.status || "Processing"}
                            </Badge>
                          </div>

                          <div className="card-body">
                            {order.items.map((item, i) => (
                              <div
                                key={`${order._id}-item-${i}`}
                                className="d-flex align-items-center mb-3 pb-3 border-bottom"
                              >
                                <img
                                  src={
                                    item.image?.startsWith("http")
                                      ? item.image
                                      : `${BASE_URL}/uploads/${item.image}`
                                  }
                                  alt={item.name}
                                  style={{
                                    width: 70,
                                    height: 70,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                                  }}
                                />

                                <div className="flex-grow-1 ms-3">
                                  <h6 className="mb-1">{item.name}</h6>
                                  <div>
                                    Qty: <strong>{item.qty}</strong> | Price:{" "}
                                    <strong>₹{item.price.toFixed(2)}</strong> |
                                    Total:{" "}
                                    <strong>
                                      ₹{(item.qty * item.price).toFixed(2)}
                                    </strong>
                                  </div>
                                </div>
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() =>
                                    handleViewProduct(order._id, item)
                                  }
                                  title="Return or View Details"
                                >
                                  <FaEye />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mobile: Similar structure but stacked */}
                    <div className="d-block d-md-none">
                      {orders.map((order, idx) => (
                        <div
                          key={order._id}
                          className="card mb-4 shadow-sm"
                          style={{ borderRadius: 12 }}
                        >
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <div>
                              <strong>Order #{idx + 1}</strong>{" "}
                              <small className="text-muted">
                                -{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                            <Badge
                              bg={
                                order.status === "Delivered"
                                  ? "success"
                                  : order.status === "Processing"
                                  ? "warning"
                                  : "secondary"
                              }
                              className="text-uppercase"
                              style={{ fontSize: "0.9rem" }}
                            >
                              {order.status || "Processing"}
                            </Badge>
                          </div>

                          <div className="card-body">
                            {order.items.map((item, i) => (
                              <div
                                key={`${order._id}-item-mobile-${i}`}
                                className="d-flex align-items-center mb-3 pb-3 border-bottom"
                              >
                                <img
                                  src={`${BASE_URL}/uploads/${item.image}`}
                                  alt={item.name}
                                  style={{
                                    width: 70,
                                    height: 70,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                                  }}
                                />
                                <div className="flex-grow-1 ms-3">
                                  <h6 className="mb-1">{item.name}</h6>
                                  <div>
                                    Qty: <strong>{item.qty}</strong> | Price:{" "}
                                    <strong>₹{item.price.toFixed(2)}</strong> |
                                    Total:{" "}
                                    <strong>
                                      ₹{(item.qty * item.price).toFixed(2)}
                                    </strong>
                                  </div>
                                </div>
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() =>
                                    handleViewProduct(order._id, item)
                                  }
                                  title="Return or View Details"
                                >
                                  <FaEye />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Your Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Your age"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default MyOrders;
