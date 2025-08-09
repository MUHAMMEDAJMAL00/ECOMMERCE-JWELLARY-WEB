import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { FaUser, FaBoxOpen } from "react-icons/fa";

const GetOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3001/orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/orders/${orderId}/status`, {
        status: newStatus,
      });

      // ✅ Refetch all orders after update
      const res = await axios.get("http://localhost:3001/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    }
  };

  return (
    <div className="p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        <FaBoxOpen className="inline mr-2 text-blue-500" />
        All Orders
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white-900 shadow-lg dark:bg-gray-200 border rounded shadow text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 bg-white uppercase">
                <th className="py-3 px-4 border text-left">#</th>
                <th className="py-3 px-4 border text-left">
                  <FaUser className="inline mr-1" />
                  Name
                </th>
                <th className="py-3 px-4 border text-left">
                  <MdEmail className="inline mr-1" />
                  Email
                </th>
                <th className="py-3 px-4 border text-left">
                  <MdLocationOn className="inline mr-1" />
                  Address
                </th>
                <th className="py-3 px-4 border text-left">Product</th>
                <th className="py-3 px-4 border text-left">Quantity</th>
                <th className="py-3 px-4 border text-left">Price (₹)</th>
                <th className="py-3 px-4 border text-left">Total Price (₹)</th>
                <th className="py-3 px-4 border text-left">Status</th>
                <th className="py-3 px-4 border text-left">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {orders.map((order, index) =>
                order.items?.map((item, itemIndex) => (
                  <tr
                    key={`${order._id}-${itemIndex}`}
                    className="hover:bg-gray-50 border-t"
                  >
                    {/* Only show main order info on first item row */}
                    {itemIndex === 0 && (
                      <>
                        <td
                          className="py-3 px-4 border"
                          rowSpan={order.items.length}
                        >
                          {index + 1}
                        </td>
                        <td
                          className="py-3 px-4 border"
                          rowSpan={order.items.length}
                        >
                          {order.address?.name || "Unknown"}
                        </td>
                        <td
                          className="py-3 px-4 border"
                          rowSpan={order.items.length}
                        >
                          {order.user?.email || "N/A"}
                        </td>
                        <td
                          className="py-3 px-4 border text-sm"
                          rowSpan={order.items.length}
                        >
                          <div>
                            {order.address?.flat}, {order.address?.street}
                          </div>
                          <div>
                            {order.address?.city}, {order.address?.state}
                          </div>
                          <div>{order.address?.country}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Phone Number: {order.address?.phone}
                          </div>
                        </td>
                      </>
                    )}

                    <td className="py-3 px-4 border">{item.name}</td>
                    <td className="py-3 px-4 border text-center">{item.qty}</td>
                    <td className="py-3 px-4 border">
                      ₹{item.price.toFixed(2)}
                    </td>

                    {/* Only show total price, status, date on first row */}
                    {itemIndex === 0 && (
                      <>
                        <td
                          className="py-3 px-4 border font-semibold text-green-700"
                          rowSpan={order.items.length}
                        >
                          ₹{order.totalPrice?.toFixed(2)}
                        </td>
                        <td
                          className="py-3 px-4 border"
                          rowSpan={order.items.length}
                        >
                          <select
                            className="form-select form-select-sm fw-semibold"
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            style={{
                              backgroundColor:
                                order.status === "Processing"
                                  ? "#fff3cd"
                                  : order.status === "Shipped"
                                  ? "#cfe2ff"
                                  : order.status === "Delivered"
                                  ? "#d1e7dd"
                                  : order.status === "Cancelled"
                                  ? "#f8d7da"
                                  : "#f8f9fa",
                              color:
                                order.status === "Processing"
                                  ? "#856404"
                                  : order.status === "Shipped"
                                  ? "#084298"
                                  : order.status === "Delivered"
                                  ? "#0f5132"
                                  : order.status === "Cancelled"
                                  ? "#842029"
                                  : "#495057",
                              border: "1px solid #ced4da",
                            }}
                          >
                            <option value="" disabled>
                              -- Select Status --
                            </option>
                            <option value="Processing"> Processing</option>
                            <option value="Shipped"> Shipped</option>
                            <option value="Delivered"> Delivered</option>
                            <option value="Cancelled"> Cancelled</option>
                          </select>
                        </td>

                        <td
                          className="py-3 px-4 border"
                          rowSpan={order.items.length}
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
    </div>
  );
};

export default GetOrders;
