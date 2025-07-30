const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent, pdfPath) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true,
    });

    const mailOptions = {
      from: `"Jwellaryyy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments: pdfPath
        ? [
            {
              filename: "invoice.pdf",
              path: pdfPath,
              contentType: "application/pdf",
            },
          ]
        : [],
    };

    console.log("📧 Sending email to:", to);
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent!");
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

module.exports = sendEmail;
