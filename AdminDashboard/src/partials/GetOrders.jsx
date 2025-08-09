import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { FaUser, FaBoxOpen, FaUndo } from "react-icons/fa";

const BASE_URL = "http://localhost:3001"; // Change if using deployed backend

const GetOrders = () => {
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingReturns, setLoadingReturns] = useState(true);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/orders`);
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch Return Orders
  const fetchReturns = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/returns`);
      setReturns(res.data);
    } catch (error) {
      console.error("Error fetching returns:", error);
    } finally {
      setLoadingReturns(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchReturns();
  }, []);

  // Change Order Status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/orders/${orderId}/status`, {
        status: newStatus,
      });
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    }
  };

  // Change Return Status
  const handleReturnStatusChange = async (returnId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/returns/${returnId}/status`, {
        status: newStatus,
      });
      fetchReturns(); // Refresh returns
    } catch (error) {
      console.error("Error updating return status:", error);
      alert("Failed to update return status");
    }
  };

  return (
    <div className="p-6 shadow-lg">
      {/* Orders Table */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        <FaBoxOpen className="inline mr-2 text-blue-500" />
        All Orders
      </h2>

      {loadingOrders ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full bg-white shadow-lg border rounded text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase">
                <th className="py-3 px-4 border">#</th>
                <th className="py-3 px-4 border">Name</th>
                <th className="py-3 px-4 border">Email</th>
                <th className="py-3 px-4 border">Address</th>
                <th className="py-3 px-4 border">Product</th>
                <th className="py-3 px-4 border">Qty</th>
                <th className="py-3 px-4 border">Price</th>
                <th className="py-3 px-4 border">Total</th>
                <th className="py-3 px-4 border">Status</th>
                <th className="py-3 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) =>
                order.items?.map((item, itemIndex) => (
                  <tr key={`${order._id}-${itemIndex}`} className="border-t">
                    {itemIndex === 0 && (
                      <>
                        <td
                          rowSpan={order.items.length}
                          className="py-3 px-4 border"
                        >
                          {index + 1}
                        </td>
                        <td
                          rowSpan={order.items.length}
                          className="py-3 px-4 border"
                        >
                          {order.address?.name || "Unknown"}
                        </td>
                        <td
                          rowSpan={order.items.length}
                          className="py-3 px-4 border"
                        >
                          {order.user?.email || "N/A"}
                        </td>
                        <td
                          rowSpan={order.items.length}
                          className="py-3 px-4 border"
                        >
                          {order.address?.flat}, {order.address?.street},{" "}
                          {order.address?.city}, {order.address?.state},{" "}
                          {order.address?.country} <br />
                          <small>📞 {order.address?.phone}</small>
                        </td>
                      </>
                    )}

                    <td className="py-3 px-4 border">{item.name}</td>
                    <td className="py-3 px-4 border text-center">{item.qty}</td>
                    <td className="py-3 px-4 border">
                      ₹{item.price.toFixed(2)}
                    </td>

                    {itemIndex === 0 && (
                      <>
                        <td
                          rowSpan={order.items.length}
                          className="py-3 px-4 border font-bold text-green-600"
                        >
                          ₹{order.totalPrice?.toFixed(2)}
                        </td>
                        <td
                          rowSpan={order.items.length}
                          className="py-3 px-4 border"
                        >
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="border rounded p-1"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td
                          rowSpan={order.items.length}
                          className="py-3 px-4 border"
                        >
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

      {/* Returns Table */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        <FaUndo className="inline mr-2 text-red-500" />
        Return Orders
      </h2>

      {loadingReturns ? (
        <p className="text-gray-500">Loading return orders...</p>
      ) : returns.length === 0 ? (
        <p className="text-gray-500">No return orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg border rounded text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase">
                <th className="py-3 px-4 border">#</th>
                <th className="py-3 px-4 border">Order ID</th>
                <th className="py-3 px-4 border">Product</th>
                <th className="py-3 px-4 border">User</th>
                <th className="py-3 px-4 border">Reason</th>
                <th className="py-3 px-4 border">Status</th>
                <th className="py-3 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((ret, index) => (
                <tr key={ret._id} className="border-t">
                  <td className="py-3 px-4 border">{index + 1}</td>
                  <td className="py-3 px-4 border">{ret.orderId}</td>
                  <td className="py-3 px-4 border">
                    {ret.product?.name || "N/A"}
                  </td>
                  <td className="py-3 px-4 border">
                    {ret.user?.email || "N/A"}
                  </td>
                  <td className="py-3 px-4 border">{ret.reason}</td>
                  <td className="py-3 px-4 border">
                    <select
                      value={ret.status}
                      onChange={(e) =>
                        handleReturnStatusChange(ret._id, e.target.value)
                      }
                      className="border rounded p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 border">
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

export default GetOrders;
