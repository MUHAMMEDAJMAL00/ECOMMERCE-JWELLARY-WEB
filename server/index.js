const fs = require("fs");
require("dotenv").config();
const express = require("express");

const returnRoutes = require("./Routes/returnRoutes"); // adjust path if needed

const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/employee");
const Banner = require("./models/Banners");
const adminRoutes = require("./admin");
const upload = require("./middleware/upload");
const path = require("path");
const Category = require("./models/Category");
const GoldPrice = require("./models/Jwellaryprice");
const adSection = require("./models/adSections");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Goldad = require("./models/Goldad");
const Topmodels = require("./models/Topproducts");
const Order = require("./models/Order");
const Gender = require("./models/Genders");
const Trending = require("./models/Trending");
const newProduct = require("./models/Product");
const locationRoutes = require("./Routes/location");
const SECRET = "yourSecretKey";
const Razorpay = require("razorpay"); //payment
const sendEmail = require("../server/Utilis/sendEmail");
const generateInvoicePDF = require("../server/Utilis/invoiceGenerator");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://goldora.vercel.app", // ✅ Vercel live site
    ],
    credentials: true,
  })
);

app.use("/returns", returnRoutes);

app.use("/api", locationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ Connection error:", err));
//---------------------------------------------------------------------------
const razorpay = new Razorpay({
  key_id: "rzp_test_Wsj59hTGf0eyZo",
  key_secret: "VzZLGYFQTxQf3u6fecs5IOky",
});

app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // amount in paise
    currency: "INR",
    receipt: "order_rcptid_11",
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).send("Error creating Razorpay order");
  }
});

//---------------------------------------------------------------------------

// now both models share this one connection
app.get("/employees", async (req, res) => {
  try {
    const employees = await User.find(); // fetch all documents
    res.status(200).json({ data: employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error while fetching employees",
      details: err.message,
    });
  }
});
app.get("/allproducts", async (req, res) =>
  res.json(await ProductModel.find())
);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password"); // hide password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Get total count of documents matching search
    const totalUsers = await User.countDocuments({
      name: { $regex: searchQuery, $options: "i" },
    });

    // Fetch only the users for the current page
    const users = await User.find({
      name: { $regex: searchQuery, $options: "i" },
    })
      .skip(skip)
      .limit(limit);

    // Send both data and total pages
    res.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
});

app.get((req, res) => {
  const id = req.params.id;
  User.findById({ _id: id })
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //check if user exists
  const user = await User.findOne({ email });
  console.log(user);

  if (!user) return res.status(404).json({ message: "user not found" });

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  //generating token
  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
  delete user.password;
  //  Send token to frontend
  res.json({ token, user });
});

// app.post("/createUser", (req, res) => {
//    User.create(req.body)
//     .then((users) => res.json(users))
//     .catch((err) => res.json(err));
// });

//--------------------------

//--------------------------
app.post("/register", async (req, res) => {
  const { email, password, name, age, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      age,
      phone,
    });

    res.status(201).json({
      message: "User registered",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        phone: newUser.phone,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
-(
  //-----

  //-----

  app.delete("/deleteUser/:id", (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete({ _id: id })
      .then((users) => res.json(users))
      .catch((err) => res.json(err));
  })
);

app.put("/updateUser/:id", (req, res) => {
  const id = req.params.id;
  User.findByIdAndUpdate(
    { _id: id },
    {
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      phone: req.body.phone,
    }
  )

    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

// ------------  Category

app.post("/category", upload.single("image"), async (req, res) => {
  try {
    const { name, description, masterCategoryId } = req.body;
    const category = await Category({
      name,
      image: `https://ecommerce-jwellary-backend.onrender.com/uploads/${req?.file.filename}`,
      description,
      masterCategoryId,
    });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create category" });
  }
});

app.get("/category", async (req, res) => {
  try {
    const categories = await Category.find().populate(
      "masterCategoryId",
      "name"
    );
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// -----------categorie by id
app.get("/category/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------edit category
app.put("/category/:id", async (req, res) => {
  const { name, description, masterCategoryId } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        masterCategoryId,
      },
      { new: true }
    ).populate("masterCategoryId", "name"); // populate updated data

    res.json(updatedCategory);
  } catch (error) {
    console.error("PUT /category/:id error:", error);
    res.status(500).json({ error: "Category update failed" });
  }
});

// -------------
app.delete("/category/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE /category/:id error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// -------------
// -------------for banner

app.post("/banner", upload.single("image"), async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL;

    const banner = await Banner({
      image: `${baseUrl}/uploads/${req.file.filename}`,

      title: req.body.title,
      description: req.body.description,
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/banner", async (req, res) => {
  try {
    const banner = await Banner.find();
    res.status(201).json(banner);
  } catch (err) {
    res.send(500).json({ error: err.message });
  }
});
// --------------------------------------gold Price
app.post("/goldprice", async (req, res) => {
  console.log("GET /goldprice hit ✅"); // Add this line
  try {
    const newPrice = new GoldPrice(req.body);
    const savedPrice = await newPrice.save();
    res.status(201).json(savedPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/goldprice", async (req, res) => {
  try {
    let latest = await GoldPrice.find().sort({ createdAt: -1 }).limit(1);
    if (!latest.length) {
      // No data in DB
      return res.json({
        date: new Date().toISOString().split("T")[0],
        gold24: 235.5,
        gold22: 220.75,
        gold21: 210.0,
        gold18: 185.2,
        silver: 2.5,
      });
    }
    res.json(latest[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------- for adSections4

app.post("/adsection", upload.single("image"), async (req, res) => {
  try {
    const { text, image } = req.body;
    const sections = await adSection({
      image: `https://ecommerce-jwellary-backend.onrender.com/uploads/${req.file.filename}`,

      text: req.body.text,
    });
    await sections.save();
    res.status(201).json(sections);
  } catch (err) {
    console.log("its an error", err);
    res.status(500).send("Upload failed");
  }
});

// -----------------------------------adsection get
app.get("/adsection", async (req, res) => {
  try {
    const data = await adSection.find();
    res.status(200).json(data);
  } catch (err) {
    res.send(500).json({ error: err.message });
  }
});

// ----------------------goldad

app.post("/goldad", upload.single("image"), async (req, res) => {
  try {
    const { text, description, categoryId } = req.body;

    const sections = new Goldad({
      image: `https://ecommerce-jwellary-backend.onrender.com/uploads/${req.file.filename}`, // ✅ Replaced localhost with deployed URL
      text,
      description,
      categoryId,
    });

    await sections.save();
    res.status(201).json(sections);
  } catch (err) {
    console.log("❌ Upload error:", err);
    res.status(500).send("Upload failed");
  }
});

// --------------------------------------------get of goldd
app.get("/goldad", async (req, res) => {
  try {
    const data = await Goldad.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------topproducts post

app.post("/topproducts", upload.single("image"), async (req, res) => {
  try {
    const { title, stock, stocks, aed } = req.body;

    const imageUrl = `https://ecommerce-jwellary-backend.onrender.com/uploads/${req.file.filename}`;

    const response = new Topmodels({
      image: imageUrl,
      stock,
      title,
      stocks,
      aed,
    });

    await response.save();
    res.status(201).json(response);
  } catch (err) {
    console.log("❌ Upload error:", err);
    res.status(500).send("Upload failed");
  }
});

// -------------------------------------------------topmodels get
app.get("/topproducts", async (req, res) => {
  try {
    const data = await Topmodels.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------genders post
app.post("/genders", upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;

    const response = await Gender({
      image: `${process.env.BASE_URL}/uploads/${req.file.filename}`, // ✅ uses deployed URL
      text,
    });

    await response.save();
    res.status(200).json(response);
  } catch (err) {
    console.log("its an error in genders", err);
    res.status(500).send("Upload genders failed");
  }
});

// -------------------------------------------------genders get

app.get("/genders", async (req, res) => {
  try {
    const response = await Gender.find();
    res.status(200).json(response);
  } catch (err) {
    res.send(500).json({ error: err.message });
  }
});
// -------------------------------------------------post of trending

app.post("/trending", upload.single("image"), async (req, res) => {
  try {
    const { title, stock, stocks, aed, rating } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is missing" });
    }

    const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

    const response = new Trending({
      image: imageUrl,
      stock,
      title,
      stocks,
      aed,
      rating,
    });

    await response.save();
    res.status(201).json(response);
  } catch (err) {
    console.error("🚨 Upload trending failed:", err);
    res.status(500).send("Upload failed");
  }
});

// -------------------------------------------------get of trending

app.get("/trending", async (req, res) => {
  try {
    const data = await Trending.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// -------------------------------------------------categoru products post api
// const Product = require("./models/Product"); // your Mongoose model
const MasterCategory = require("./models/MasterCategory");
const Cartt = require("./models/CartModel");
const Address = require("./models/Address");
const wishlist = require("./models/whishlist");

app.post("/products", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      stocks,
      aed,
      weight,
      masterCategory,
      metalPurity,
      availableToOrder,
      rating,
      isTopProduct,
      isTrending,
    } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const newProducts = new newProduct({
      name,
      description,
      price,
      category,
      masterCategory,
      stock,
      stocks,
      weight,
      metalPurity,
      availableToOrder,
      aed,
      rating,
      isTopProduct: isTopProduct === "true" || isTopProduct === true,
      isTrending: isTrending === "true" || isTrending === true,
      image: imagePath,
    });

    const saved = await newProducts.save();
    res.status(201).json({ message: "Product created", product: saved });
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ error: "Error saving product" });
  }
});
// -------------------------------------------------categoru products api get

app.get("/products", async (req, res) => {
  try {
    const products = await newProduct
      .find()
      .populate("category")
      .populate("masterCategory");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------/ GET /products/category/:categoryId

app.get("/products/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const sort = req.query.sort;

    const skip = (page - 1) * limit;
    // pricefiltering
    const sortOption =
      sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    const total = await newProduct.countDocuments({ category: categoryId });

    // only the products needed for this page
    const products = await newProduct
      .find({ category: categoryId })
      .populate("category")
      .skip(skip)
      .sort(sortOption)
      .limit(limit);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// -------------------------------------------------

// GET /api/products/top
app.get("/products/top", async (req, res) => {
  try {
    const topProducts = await newProduct.find({ isTopProduct: true });
    res.json(topProducts);
  } catch (err) {
    console.error("🔥 ERROR IN /products/top:", err); // ✅ log the real error
    res.status(500).json({ error: err.message });
  }
});
// -------------------------------------------------

app.get("/products/trending", async (req, res) => {
  try {
    const trendingProducts = await newProduct.find({ isTrending: true });
    res.json(trendingProducts);
  } catch (err) {
    console.error("🔥 ERROR IN /products/trending:", err); // ✅ log the real error
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------

// -------------------------------------------------products get by id
app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await newProduct
      .findById(id)
      .populate("category")
      .populate("masterCategory");
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "User not found", error: err });
  }
});

// -------------------------------------------------update
app.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      stock,
      stocks,
      aed,
      rating,
      masterCategory,
      weight,
      metalPurity,
      availableToOrder,
      category,
      isTopProduct,
      isTrending,
    } = req.body;

    // If image is uploaded
    let imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedFields = {
      name,
      description,
      price,
      stock,
      stocks,
      aed,
      rating,
      weight,
      metalPurity,
      masterCategory,
      category,
      availableToOrder:
        availableToOrder === "true" || availableToOrder === true,
      isTopProduct: isTopProduct === "true" || isTopProduct === true,
      isTrending: isTrending === "true" || isTrending === true,
    };

    // Add image only if uploaded
    if (imagePath) {
      updatedFields.image = imagePath;
    }

    const updatedProduct = await newProduct.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("PUT /products/:id error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// -------------------------------------------------

app.post("/mastercategory", async (req, res) => {
  try {
    const masterCategory = new MasterCategory(req.body);
    await masterCategory.save();
    res.status(201).json(masterCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// -------------------------------------------------

app.get("/mastercategory", async (req, res) => {
  try {
    const all = await MasterCategory.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------
app.put("/mastercategory/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, name } = req.body;

    const allData = await MasterCategory.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!allData) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(allData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// -------------------------------------------------
app.delete("/mastercategory/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const allData = await MasterCategory.findByIdAndDelete(req.params.id);
    if (!allData) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("DELETE /mastercategory/:id error:", err);
    res.status(500).json({ error: "Failed to delete Mastercategory" });
  }
});
// -------------------------------------------------
// -------------------------------------------------
app.post("/wishlist", async (req, res) => {
  const { userId, productId, price, aed } = req.body;
  try {
    const wishItem = new wishlist({
      userId,
      productId,
      price,
      aed,
    });
    await wishItem.save();
    res.status(201).json(wishItem);
    // console.log("Request body received in /wishlist:", req.body);
  } catch (err) {
    console.log("error adding to wishlist", err);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});
// -------------------------------------------------
app.get("/wishlist/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all wishlist items by user and populate product details
    const wishlistItems = await wishlist.find({ userId }).populate("productId"); // Optional: include product details

    res.status(200).json(wishlistItems);
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// -------------------------------------------------
// DELETE /wishlist/item/:id (delete by wishlist item's own _id)
app.delete("/wishlist/lists/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await wishlist.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }
    res.status(200).json({ message: "Wishlist item deleted", deletedItem });
  } catch (err) {
    console.error("Error deleting wishlist item:", err);
    res.status(500).json({ error: "Failed to delete wishlist item" });
  }
});

// -------------------------------------------------
// post of cart

app.post("/cart", async (req, res) => {
  const { userId, productId, quantity, price, aed } = req.body;
  try {
    const cartItem = new Cartt({
      userId,
      productId,
      price,
      aed,
      quantity: quantity || 1,
    });
    await cartItem.save();
    res.status(201).json(cartItem);
    console.log("Request body received in /cart:", req.body);
  } catch (err) {
    console.log("error adding to cart", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// -------------------------------------------------get cart\\

app.get("/cart/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userCart = await Cartt.find({ userId }).populate(
      "productId",
      "name price image"
    );

    res.status(200).json(userCart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// -------------------------------------------------update of cart

app.put("/cart/:cartItemId", async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  try {
    // Find the cart item and populate the productId to access price
    const cartItem = await Cartt.findById(cartItemId).populate("productId");

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Calculate new price
    const newPrice = cartItem.productId.price * quantity;

    // Update quantity and price
    cartItem.quantity = quantity;
    cartItem.price = newPrice;
    await cartItem.save();

    res.status(200).json(cartItem);
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// -------------------------------------------------delete od cartt
app.delete("/cart/:cartItemId", async (req, res) => {
  const { cartItemId } = req.params;

  try {
    const deletedItem = await Cartt.findByIdAndDelete(cartItemId);
    if (!deletedItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Error deleting cart item:", err);
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});

// -------------------------------------------------
// DELETE all cart items for a user
app.delete("/cart/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Cartt.deleteMany({ userId });
    res.status(200).json({
      message: "All cart items deleted",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting cart items:", err);
    res.status(500).json({ error: "Failed to delete cart items" });
  }
});

// -------------------------------------------------

// backend/index.js or wherever you define routes
app.post("/address", async (req, res) => {
  try {
    const address = new Address(req.body);
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    console.error("Error saving address:", err); // ✅ Log the actual error
    res.status(500).json({ error: "Failed to save address" });
  }
});

// -------------------------------------------------
app.get("/address/:userId", async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.params.userId });
    res.json(addresses);
  } catch (err) {
    console.error("Failed to fetch address:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// -------------------------------------------------
app.delete("/address/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAddress = await Address.findByIdAndDelete(id);
    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res
      .status(200)
      .json({ message: "Address deleted successfully", deletedAddress });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// -------------------------------------------------
app.put("/address/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Address.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // Optional: to run Mongoose validation
    });
    if (!updated) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ message: "Address updated successfully", updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// -------------------------------------------------

// -------------------------------------------------

// const Order = require("../models/Order");

app.post("/orders", async (req, res) => {
  try {
    const { user, items, address, totalPrice, paymentMethod } = req.body;

    if (!user || !items || !address || !totalPrice || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Explicit mapping so all required fields are stored, including image
    const orderItems = items.map((item) => ({
      name: item.name,
      productId: item.productId,
      qty: item.qty,
      price: item.price,
      image: item.image || "", // ✅ ensure image gets stored
    }));

    const newOrder = new Order({
      user,
      items: orderItems,
      address: {
        ...address,
        paymentMethod,
      },
      totalPrice,
    });

    const savedOrder = await newOrder.save();

    // Generate PDF Invoice
    const pdfPath = await generateInvoicePDF(savedOrder);

    // Send email if possible
    if (address.email) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Thank You for Your Order</h2>
          <p>Your order has been placed successfully.</p>
          <p><strong>Order ID:</strong> ${savedOrder._id}</p>
          <p><strong>Total:</strong> ₹${totalPrice}</p>
          <p><strong>Payment:</strong> ${paymentMethod}</p>
        </div>
      `;

      await sendEmail(
        address.email,
        "Order Confirmation with Invoice",
        emailHtml,
        pdfPath
      );

      if (!fs.existsSync(pdfPath)) {
        console.error("❌ PDF file not found:", pdfPath);
        return res.status(500).json({ message: "Invoice PDF not found." });
      }

      // Optional: Delete PDF after sending
      fs.unlink(pdfPath, (err) => {
        if (err) console.error("Error deleting invoice PDF:", err);
      });
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") // Optional: to get user details
      .sort({ createdAt: -1 }); // Most recent orders first

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------
app.get("/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("user") // ✅ Populate user info
      .populate("items.productId"); // ✅ Populate product info inside items array

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------
// Update order status by ID
app.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find and update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
app.listen(3001, () => {
  console.log("server is running");
});
