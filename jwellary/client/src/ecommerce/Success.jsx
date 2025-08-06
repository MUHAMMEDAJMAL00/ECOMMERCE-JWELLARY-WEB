import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { clearOrder } from "../redux/slices/orderSlice";
import { FaCheckCircle, FaBox, FaHome } from "react-icons/fa";
import jsPDF from "jspdf";

const ThankYouPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const reduxOrder = useSelector((state) => state.order.order);
  const [order, setOrder] = useState(location.state?.order || reduxOrder);

  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    if (order) {
      setShowPage(true);
      const timeout = setTimeout(() => {
        dispatch(clearOrder());
      }, 100000);
      return () => clearTimeout(timeout);
    } else {
      navigate("/");
    }
  }, [order, dispatch, navigate]);

  const generateInvoice = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors
    const primaryColor = [52, 58, 64]; // Dark gray
    const secondaryColor = [108, 117, 125]; // Medium gray
    const accentColor = [40, 167, 69]; // Success green
    const lightGray = [248, 249, 250];

    // Header Background
    doc.setFillColor(...lightGray);
    doc.rect(0, 0, pageWidth, 40, "F");

    // Company Logo/Name Area
    doc.setFillColor(...primaryColor);
    doc.rect(14, 8, 60, 24, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("JEWELLERY", 44, 18, { align: "center" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Excellence in Service", 44, 26, { align: "center" });

    // Invoice Title
    doc.setTextColor(...primaryColor);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth - 14, 20, { align: "right" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`#${order._id.slice(-8).toUpperCase()}`, pageWidth - 14, 28, {
      align: "right",
    });

    // Invoice Details Box - PROPERLY SIZED
    doc.setFillColor(...lightGray);
    doc.rect(pageWidth - 90, 45, 76, 48, "F"); // Better proportions
    doc.setDrawColor(...secondaryColor);
    doc.rect(pageWidth - 90, 45, 76, 48, "S");

    doc.setTextColor(...primaryColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Date:", pageWidth - 88, 52);
    doc.text("Due Date:", pageWidth - 88, 60);
    doc.text("Order ID:", pageWidth - 88, 68);
    doc.text("Payment:", pageWidth - 88, 76);

    doc.setFont("helvetica", "normal");
    const invoiceDate = new Date(order.createdAt).toLocaleDateString();
    const dueDate = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString();

    doc.text(invoiceDate, pageWidth - 16, 52, { align: "right" });
    doc.text(dueDate, pageWidth - 16, 60, { align: "right" });
    doc.text(order._id.slice(-8), pageWidth - 16, 68, { align: "right" });

    // Payment method with better handling
    const paymentMethod = order.address.paymentMethod;
    if (paymentMethod.length > 14) {
      const words = paymentMethod.split(" ");
      if (words.length > 1) {
        doc.text(words[0], pageWidth - 16, 76, { align: "right" });
        doc.text(words.slice(1).join(" "), pageWidth - 16, 84, {
          align: "right",
        });
      } else {
        // If single long word, truncate
        doc.text(paymentMethod.substring(0, 12) + "...", pageWidth - 16, 76, {
          align: "right",
        });
      }
    } else {
      doc.text(paymentMethod, pageWidth - 16, 76, { align: "right" });
    }

    // Customer Information
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("BILL TO:", 14, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);

    // Handle long addresses
    const address = order.address.fullAddress;
    if (address.length > 50) {
      const addressParts = address.match(/.{1,50}(\s|$)/g) || [address];
      doc.text(addressParts[0].trim(), 14, 65);
      if (addressParts[1]) {
        doc.text(addressParts[1].trim(), 14, 72);
        doc.text(`${order.address.city}, ${order.address.state}`, 14, 79);
        doc.text(order.address.country, 14, 86);
        doc.text(`Phone: ${order.address.phone}`, 14, 93);
      } else {
        doc.text(`${order.address.city}, ${order.address.state}`, 14, 72);
        doc.text(order.address.country, 14, 79);
        doc.text(`Phone: ${order.address.phone}`, 14, 86);
      }
    } else {
      doc.text(address, 14, 65);
      doc.text(`${order.address.city}, ${order.address.state}`, 14, 72);
      doc.text(order.address.country, 14, 79);
      doc.text(`Phone: ${order.address.phone}`, 14, 86);
    }

    // Items Table - FIXED COLUMN WIDTHS AND POSITIONING
    const tableStartY = 115; // Moved further down
    const tableWidth = pageWidth - 28;
    const itemNameWidth = 80;
    const qtyWidth = 25;
    const priceWidth = 35;
    const totalWidth = 35;

    // Table Header
    doc.setFillColor(...primaryColor);
    doc.rect(14, tableStartY, tableWidth, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    // Column headers with proper positioning
    doc.text("ITEM", 16, tableStartY + 7.5);
    doc.text("QTY", 14 + itemNameWidth + qtyWidth / 2, tableStartY + 7.5, {
      align: "center",
    });
    doc.text(
      "UNIT PRICE",
      14 + itemNameWidth + qtyWidth + priceWidth / 2,
      tableStartY + 7.5,
      { align: "center" }
    );
    doc.text("TOTAL", pageWidth - 16, tableStartY + 7.5, { align: "right" });

    // Items Table Content
    let currentY = tableStartY + 12;
    let subtotal = 0;

    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "normal");

    order.items.forEach((item, index) => {
      const itemTotal = parseFloat(item.price) * item.qty;
      subtotal += itemTotal;

      // Alternating row colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(14, currentY, tableWidth, 12, "F");
      }

      doc.setFontSize(9);

      // Item name with proper truncation
      const maxItemNameLength = 35;
      const itemName =
        item.name.length > maxItemNameLength
          ? item.name.substring(0, maxItemNameLength - 3) + "..."
          : item.name;

      // Properly positioned content
      doc.text(itemName, 16, currentY + 7.5);
      doc.text(
        item.qty.toString(),
        14 + itemNameWidth + qtyWidth / 2,
        currentY + 7.5,
        { align: "center" }
      );
      doc.text(
        `₹${parseFloat(item.price).toFixed(2)}`,
        14 + itemNameWidth + qtyWidth + priceWidth / 2,
        currentY + 7.5,
        { align: "center" }
      );
      doc.text(`₹${itemTotal.toFixed(2)}`, pageWidth - 16, currentY + 7.5, {
        align: "right",
      });

      currentY += 12;
    });

    // Table borders and column separators
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.5);

    // Outer border
    doc.rect(14, tableStartY, tableWidth, currentY - tableStartY, "S");

    // Vertical column separators
    doc.line(14 + itemNameWidth, tableStartY, 14 + itemNameWidth, currentY);
    doc.line(
      14 + itemNameWidth + qtyWidth,
      tableStartY,
      14 + itemNameWidth + qtyWidth,
      currentY
    );
    doc.line(
      14 + itemNameWidth + qtyWidth + priceWidth,
      tableStartY,
      14 + itemNameWidth + qtyWidth + priceWidth,
      currentY
    );

    // Summary Section - PROPERLY CONTAINED
    const summaryY = currentY + 20;
    const summaryWidth = 85;
    const summaryX = pageWidth - summaryWidth - 5;

    // Summary background with proper sizing
    doc.setFillColor(...lightGray);
    doc.rect(summaryX, summaryY - 5, summaryWidth, 50, "F");
    doc.setDrawColor(...secondaryColor);
    doc.rect(summaryX, summaryY - 5, summaryWidth, 50, "S");

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...primaryColor);

    // Calculate actual values from order
    const actualSubtotal = subtotal;
    const shippingFee = 50;
    const taxRate = 0.18;
    const tax = actualSubtotal * taxRate;
    const calculatedTotal = actualSubtotal + shippingFee + tax;
    const actualTotal = parseFloat(order.totalPrice);

    // Summary content with proper alignment
    const labelX = summaryX + 5;
    const valueX = pageWidth - 10;

    doc.text("Subtotal:", labelX, summaryY + 5);
    doc.text(`₹${actualSubtotal.toFixed(2)}`, valueX, summaryY + 5, {
      align: "right",
    });

    doc.text("Shipping:", labelX, summaryY + 13);
    doc.text(`₹${shippingFee.toFixed(2)}`, valueX, summaryY + 13, {
      align: "right",
    });

    doc.text("Tax (18%):", labelX, summaryY + 21);
    doc.text(`₹${tax.toFixed(2)}`, valueX, summaryY + 21, { align: "right" });

    // Total line
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.line(labelX, summaryY + 26, valueX, summaryY + 26);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...accentColor);
    doc.text("TOTAL:", labelX, summaryY + 34);
    doc.text(`₹${actualTotal.toFixed(2)}`, valueX, summaryY + 34, {
      align: "right",
    });

    // Payment Status Badge
    const badgeY = summaryY + 40;
    const paymentStatus =
      order.address.paymentMethod === "Cash on Delivery" ? "PENDING" : "PAID";
    const badgeColor = paymentStatus === "PAID" ? accentColor : [255, 193, 7];

    doc.setFillColor(...badgeColor);
    doc.roundedRect(labelX, badgeY, 40, 10, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(paymentStatus, labelX + 20, badgeY + 6, { align: "center" });

    // Footer with dynamic positioning
    const footerY = Math.max(pageHeight - 50, summaryY + 65);

    // Footer background
    doc.setFillColor(...lightGray);
    doc.rect(0, footerY - 5, pageWidth, 50, "F");

    doc.setTextColor(...secondaryColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    // Terms and conditions
    doc.text("Terms & Conditions:", 14, footerY + 5);
    doc.setFontSize(8);
    doc.text(
      "• Payment is due within 30 days of invoice date",
      14,
      footerY + 12
    );
    doc.text("• Late payments may incur additional charges", 14, footerY + 18);
    doc.text("• Returns accepted within 7 days of delivery", 14, footerY + 24);

    // Contact information
    doc.setFontSize(9);
    doc.text("Questions? Contact us:", pageWidth - 90, footerY + 5);
    doc.setFontSize(8);
    doc.text("Email: support@yourstore.com", pageWidth - 90, footerY + 12);
    doc.text("Phone: +1 (555) 123-4567", pageWidth - 90, footerY + 18);
    doc.text("Website: www.yourstore.com", pageWidth - 90, footerY + 24);

    // Thank you message
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accentColor);
    doc.text("Thank you for your business!", pageWidth / 2, footerY + 35, {
      align: "center",
    });

    // Save the PDF
    doc.save(`Invoice-${order._id}-${invoiceDate.replace(/\//g, "-")}.pdf`);
  };

  if (!showPage || !order) return null;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white text-center py-4">
              <FaCheckCircle size={60} className="mb-3" />
              <h2 className="fw-bold mb-2">Order Confirmed!</h2>
              <p className="mb-0 opacity-75">
                Thank you for choosing us. Your order has been placed
                successfully.
              </p>
            </div>

            <div className="card-body p-4">
              {/* Order Summary Card */}
              <div className="card border-0 bg-light mb-4">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-3">
                    <i className="bi bi-file-text me-2"></i>Order Summary
                  </h5>
                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted">Order ID</small>
                      <p className="fw-semibold mb-2">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Date</small>
                      <p className="fw-semibold mb-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Total Amount</small>
                      <p className="fw-bold text-success fs-5 mb-2">
                        ₹{parseFloat(order.totalPrice).toFixed(2)}
                      </p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Payment Method</small>
                      <p className="fw-semibold mb-2">
                        <span
                          className={`badge ${
                            order.address.paymentMethod === "Cash on Delivery"
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                        >
                          {order.address.paymentMethod}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="card border-0 bg-light mb-4">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-3">
                    <i className="bi bi-geo-alt me-2"></i>Delivery Address
                  </h5>
                  <address className="mb-0">
                    <strong>{order.address.fullAddress}</strong>
                    <br />
                    {order.address.city}, {order.address.state}
                    <br />
                    {order.address.country}
                    <br />
                    <abbr title="Phone">Phone:</abbr> {order.address.phone}
                  </address>
                </div>
              </div>

              {/* Items Ordered Card */}
              <div className="card border-0 bg-light mb-4">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-3">
                    <i className="bi bi-bag me-2"></i>Items Ordered (
                    {order.items.length})
                  </h5>
                  <div className="list-group list-group-flush">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="list-group-item bg-transparent px-0 d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <h6 className="mb-1">{item.name}</h6>
                          <small className="text-muted">
                            Quantity: {item.qty}
                          </small>
                        </div>
                        <span className="fw-bold">
                          ₹{parseFloat(item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced Download Invoice Button */}
              <button
                onClick={generateInvoice}
                className="btn btn-outline-success btn-lg w-100 mb-4 d-flex align-items-center justify-content-center"
                style={{ borderStyle: "dashed", borderWidth: "2px" }}
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>
                Download Professional Invoice (PDF)
              </button>

              {/* Action Buttons */}
              <div className="row g-3">
                <div className="col-md-6">
                  <Link
                    to="/orders"
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                  >
                    <FaBox className="me-2" />
                    Track Your Order
                  </Link>
                </div>
                <div className="col-md-6">
                  <Link
                    to="/"
                    className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center"
                  >
                    <FaHome className="me-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Additional Info */}
              <div className="alert alert-info mt-4 border-0" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                <strong>What's next?</strong> You'll receive an email
                confirmation shortly with your order details and tracking
                information.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
