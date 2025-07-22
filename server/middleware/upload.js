// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create folder if it doesn't exist
const bannerDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, bannerDir); // Save to /uploads/banner/
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb("Only image files allowed!", false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
