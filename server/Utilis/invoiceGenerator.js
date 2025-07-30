const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoicePDF = async (order) => {
  const invoiceDir = path.join(__dirname, "../invoices");
  const invoicePath = path.join(invoiceDir, `invoice-${order._id}.pdf`);

  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir);
  }

  const doc = new PDFDocument({ margin: 50 });
  const writeStream = fs.createWriteStream(invoicePath);
  doc.pipe(writeStream);

  // Header
  doc.fontSize(20).text("Jewellery Store Invoice", { align: "center" });
  doc.moveDown();

  // Order Info
  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.text(`Payment Method: ${order.address.paymentMethod}`);
  doc.moveDown();

  // Customer Info
  doc.fontSize(14).text("Customer Details:", { underline: true });
  doc.fontSize(12).text(`Name: ${order.address.name}`);
  doc.text(`Email: ${order.address.email}`);
  doc.text(`Phone: ${order.address.phone}`);
  doc.text(
    `Address: ${order.address.address}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`
  );
  doc.moveDown();

  // Item Table Header
  doc.fontSize(14).text("Items Ordered:", { underline: true });
  doc.moveDown(0.5);
  doc
    .fontSize(12)
    .text("No.   Product                 Price     Qty     Total");
  doc.text("-------------------------------------------------------------");

  let grandTotal = 0;

  // Items
  order.items.forEach((item, index) => {
    const total = item.price * item.qty;
    grandTotal += total;
    doc.text(
      `${index + 1}.    ${item.name.padEnd(20)} ₹${item.price
        .toString()
        .padEnd(7)} x ${item.qty}   = ₹${total}`
    );
  });

  doc.moveDown();
  doc.text("-------------------------------------------------------------");
  doc.fontSize(13).text(`Grand Total: ₹${grandTotal}`, { align: "right" });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(invoicePath));
    writeStream.on("error", reject);
  });
};

module.exports = generateInvoicePDF;
