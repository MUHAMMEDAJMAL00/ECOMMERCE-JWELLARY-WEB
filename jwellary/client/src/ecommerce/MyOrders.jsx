import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/footer";
import UserSideBar from "../components/UseSideBar";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import { updateUserInfo } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

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

  // NEW: navigate to return page, pass the whole order in state (or you can pass order._id and fetch there)
  const handleView = (order) => {
    navigate("/return", { state: { order } });
  };

  return (
    <div>
      <Header />
      <div className="container py-4">
        <div className="row">
          <div className="col-lg-3 col-md-4 mb-4">
            <div
              className="d-none d-lg-block position-sticky"
              style={{ top: "90px" }}
            >
              <UserSideBar />
            </div>
            <div className="d-block d-lg-none">
              <UserSideBar />
            </div>
          </div>

          <div className="col-lg-9 col-md-8">
            <div className="mb-4">
              <h3 className="fw-bold">My Account</h3>
              <hr />
              <div
                className="text-end text-primary fw-bold mb-3"
                style={{ cursor: "pointer" }}
                onClick={handleEditClick}
              >
                Edit
              </div>

              {userDetails && (
                <div className="bg-light rounded p-3 mb-4">
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
            </div>

            <div className="card shadow-sm rounded">
              <div className="card-body">
                <h4 className="card-title mb-3">My Orders</h4>

                {loading ? (
                  <p className="text-muted">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-muted">No orders found.</p>
                ) : (
                  <>
                    <div className="table-responsive d-none d-md-block">
                      <table className="table table-bordered table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th className="text-center">Qty</th>
                            <th>Price (₹)</th>
                            <th>Total (₹)</th>
                            <th className="text-center">Status</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order, index) =>
                            order.items.map((item, i) => (
                              <tr key={i}>
                                {i === 0 && (
                                  <td rowSpan={order.items.length}>
                                    {index + 1}
                                  </td>
                                )}
                                <td>{item.name}</td>
                                <td className="text-center">{item.qty}</td>
                                <td>₹{item.price}</td>
                                {i === 0 && (
                                  <>
                                    <td rowSpan={order.items.length}>
                                      ₹{order.totalPrice.toFixed(2)}
                                    </td>
                                    <td
                                      rowSpan={order.items.length}
                                      className="text-center"
                                    >
                                      <span
                                        className={`badge ${
                                          order.status === "Delivered"
                                            ? "bg-success"
                                            : "bg-secondary"
                                        }`}
                                      >
                                        {order.status || "Processing"}
                                      </span>
                                    </td>
                                    <td rowSpan={order.items.length}>
                                      {new Date(
                                        order.createdAt
                                      ).toLocaleString()}
                                    </td>
                                    <td
                                      rowSpan={order.items.length}
                                      className="text-center"
                                    >
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleView(order)}
                                      >
                                        Return
                                      </Button>
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="d-block d-md-none">
                      {orders.map((order, index) => (
                        <div className="card mb-3" key={index}>
                          <div className="card-body">
                            <h6 className="fw-bold">Order #{index + 1}</h6>
                            <hr />
                            {order.items.map((item, i) => (
                              <div key={i} className="mb-2">
                                <div>
                                  <strong>Product:</strong> {item.name}
                                </div>
                                <div>
                                  <strong>Qty:</strong> {item.qty}
                                </div>
                                <div>
                                  <strong>Price:</strong> ₹{item.price}
                                </div>
                              </div>
                            ))}
                            <div className="mt-2">
                              <strong>Total:</strong> ₹
                              {order.totalPrice.toFixed(2)}
                            </div>
                            <div>
                              <strong>Status:</strong>{" "}
                              <span className="badge bg-success">
                                {order.status || "Processing"}
                              </span>
                            </div>
                            <div>
                              <strong>Date:</strong>{" "}
                              {new Date(order.createdAt).toLocaleString()}
                            </div>

                            <div className="mt-3 text-end">
                              <Button
                                onClick={() => handleView(order)}
                                size="sm"
                              >
                                Return Items
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
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
    </div>
  );
};

export default MyOrders;
