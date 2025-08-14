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
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Returned Products</h2>

      {loading ? (
        <p className="text-gray-500">Loading return orders...</p>
      ) : returns.length === 0 ? (
        <p className="text-gray-500">No return orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Return ID</th>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">User Email</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((ret, idx) => (
                <tr key={ret._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{ret._id}</td>
                  <td className="p-3">{ret.orderId}</td>

                  {/* Product Name & Details */}
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">
                        {ret.product?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {ret.product?.description || ""}
                      </p>
                    </div>
                  </td>

                  {/* Product Image */}
                  <td className="p-3">
                    {ret.product?.image ? (
                      <img
                        src={ret.product.image}
                        alt={ret.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>

                  {/* User Email */}
                  <td className="p-3">{ret.user?.email || "N/A"}</td>

                  {/* User Address */}
                  <td className="p-3 text-sm text-gray-600">
                    {ret.user?.address
                      ? `${ret.user.address.street || ""}, ${
                          ret.user.address.city || ""
                        }, ${ret.user.address.state || ""}, ${
                          ret.user.address.zip || ""
                        }`
                      : "N/A"}
                  </td>

                  {/* Reason */}
                  <td className="p-3">{ret.reason}</td>

                  {/* Status Dropdown */}
                  <td className="p-3">
                    <select
                      value={ret.status}
                      onChange={(e) =>
                        handleStatusChange(ret._id, e.target.value)
                      }
                      className="border border-gray-300 rounded-md p-1 text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  {/* Date */}
                  <td className="p-3 text-gray-500">
                    {new Date(ret.createdAt).toLocaleString()}
                  </td>
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
