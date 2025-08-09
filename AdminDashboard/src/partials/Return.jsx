import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3001"; // Change this to your backend URL

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all return requests from backend
  const fetchReturns = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/returns`);
      setReturns(res.data);
    } catch (error) {
      console.error("Error fetching returns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  // Update return status
  const handleStatusChange = async (returnId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/returns/${returnId}/status`, {
        status: newStatus,
      });
      fetchReturns(); // Refresh list
    } catch (error) {
      console.error("Error updating return status:", error);
      alert("Failed to update return status");
    }
  };

  return (
    <div className="container p-4">
      <h2 className="mb-4">Returned Products</h2>

      {loading ? (
        <p>Loading return orders...</p>
      ) : returns.length === 0 ? (
        <p>No return orders found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Return ID</th>
                <th>Order ID</th>
                <th>Product</th>
                <th>User Email</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((ret, idx) => (
                <tr key={ret._id}>
                  <td>{idx + 1}</td>
                  <td>{ret._id}</td>
                  <td>{ret.orderId}</td>
                  <td>{ret.product?.name || "N/A"}</td>
                  <td>{ret.user?.email || "N/A"}</td>
                  <td>{ret.reason}</td>
                  <td>
                    <select
                      value={ret.status}
                      onChange={(e) =>
                        handleStatusChange(ret._id, e.target.value)
                      }
                      className="form-select form-select-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td>{new Date(ret.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Returns;
