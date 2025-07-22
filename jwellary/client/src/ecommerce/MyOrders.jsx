import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/footer";
import UserSideBar from "../components/UseSideBar";
import { useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";

const MyOrders = () => {
  const { user } = useSelector((state) => state.auth);
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
            axios.get(`http://localhost:3001/orders/${user._id}`),
            axios.get(`http://localhost:3001/users/${user._id}`),
          ]);
          setOrders(orderRes.data);
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

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3001/updateUser/${user._id}`,
        formData
      );
      setUserDetails((prev) => ({ ...prev, ...formData }));
      setShowModal(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div>
      <Header />
      <div className="container-fluid px-md-5 py-4">
        <div
          className="d-flex"
          style={{ gap: "70px", alignItems: "flex-start" }}
        >
          <div style={{ width: "250px", padding: "0px 0px 0px 20px" }}>
            <div className="position-sticky" style={{ top: "90px" }}>
              <UserSideBar />
            </div>
          </div>

          <div style={{ flex: 1, padding: "0px 100px 0px 0px" }}>
            <div className="mb-5">
              <h3 className="mb-4 fw-bold px-2">My Account</h3>
              <hr />
              <div
                className="text-black  ms-3 text-end fw-bold"
                style={{ cursor: "pointer" }}
                onClick={handleEditClick}
              >
                Edit
              </div>
              <div className="rounded p-3">
                {userDetails && (
                  <>
                    <div className="d-flex justify-content-between align-items-start border-bottom py-3">
                      <div className="w-100">
                        <div className="fw-semibold">Name</div>
                        <div className="text-muted">{userDetails.name}</div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-start border-bottom py-3">
                      <div className="w-100">
                        <div className="fw-semibold">Email</div>
                        <div className="text-muted">{userDetails.email}</div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-start border-bottom py-3">
                      <div className="w-100">
                        <div className="fw-semibold">Phone Number</div>
                        <div className="text-muted">{userDetails.phone}</div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-start py-3">
                      <div className="w-100">
                        <div className="fw-semibold">Age</div>
                        <div className="text-muted">
                          {userDetails.age || "—"}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="card shadow-sm rounded">
              <div className="card-body">
                <h4 className="card-title mb-4">My Orders</h4>
                {loading ? (
                  <p className="text-muted">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-muted">No orders found.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Product Name</th>
                          <th className="text-center">Qty</th>
                          <th>Price (₹)</th>
                          <th>Total (₹)</th>
                          <th className="text-center">Status</th>
                          <th>Date</th>
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
                                    <span className="badge bg-success">
                                      {order.status || "Processing"}
                                    </span>
                                  </td>
                                  <td rowSpan={order.items.length}>
                                    {new Date(order.createdAt).toLocaleString()}
                                  </td>
                                </>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
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
