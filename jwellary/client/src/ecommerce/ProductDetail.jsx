import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/newstyles.scss";
import Header from "../components/Header";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { addToCartAsync } from "../redux/slices/cartSlice";
import Footer from "../components/footer";

const BASE_URL = "https://ecommerce-jwellary-backend.onrender.com";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkIfInCart = async () => {
    try {
      if (!user?._id) return;
      const res = await axios.get(`${BASE_URL}/cart/${user._id}`);
      const isExist = res.data.some((item) => item.productId._id === id);
      setIsInCart(isExist);
    } catch (err) {
      console.error("Error checking cart:", err);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products/${id}`);
        setProduct(res.data);
        checkIfInCart();
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => quantity > 1 && setQuantity((prev) => prev - 1);

  const cartsubmit = async () => {
    try {
      if (!user?._id) return alert("Please log in first.");

      await dispatch(
        addToCartAsync({
          userId: user._id,
          productId: product._id,
          quantity,
          price: product.price * quantity,
        })
      );

      toast.success("Successfully added to cart!");
      setIsInCart(true);
      navigate("/cartpage");
    } catch (err) {
      console.error("Error in posting cart data", err);
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = () => {
    if (!user?._id) return alert("Please log in first.");

    navigate("/checkout", {
      state: {
        buyNowItem: {
          name: product.name,
          productId: product._id,
          qty: quantity,
          price: product.price,
          image: product.image?.startsWith("/uploads/")
            ? product.image
            : `/uploads/${product.image}`, // ✅ fix path
        },
        totalPrice: product.price * quantity,
      },
    });
  };

  if (!product) return <div className="text-center py-5">Loading...</div>;

  const buttonStyle = {
    width: isMobile ? "100%" : "auto",
    minWidth: isMobile ? "100%" : "150px",
  };

  return (
    <div>
      <Header />
      <div
        className="d-flex justify-content-center align-items-center mt-3 mainproducthead"
        style={{ backgroundColor: "#fff", height: "100%" }}
      >
        <div className="container-fluid p-1 mt-5">
          <div className="mx-start rounded" style={{ backgroundColor: "#fff" }}>
            <div className="row">
              <div className="col-md-5 text-center mb-4">
                <img
                  src={
                    product.image?.startsWith("http")
                      ? product.image
                      : `${BASE_URL}${product.image}`
                  }
                  alt={product.name}
                  className="rounded productimage"
                  style={{
                    objectFit: "cover",
                    width: isMobile ? "100%" : "460px",
                    height: isMobile ? "300px" : "460px",
                    maxWidth: "460px",
                  }}
                />
              </div>

              <div className="col-md-6 d-flex flex-column justify-content-center p-4">
                <h2 className="fw-bold mb-2">{product.name}</h2>
                <p className="mb-4">{product.description}</p>

                <h4 className="text-black fw-bold mb-2">
                  <span className="text-secondary fw-light">Metal Purity:</span>{" "}
                  {product.metalPurity}
                </h4>
                <h4 className="text-black fw-bold mb-2">
                  <span className="text-secondary fw-light">Weight:</span>{" "}
                  {product.weight} Gram
                </h4>
                <h4 className="text-black fw-bold mb-2">
                  <span className="text-secondary fw-light">Category:</span>{" "}
                  {product.masterCategory?.name}
                </h4>
                <h4 className="fw-bold mb-2">
                  <span
                    className={
                      product.availableToOrder ? "text-success" : "text-danger"
                    }
                  >
                    {product.availableToOrder
                      ? "Available to Order"
                      : "Out of Stock"}
                  </span>
                </h4>
                <h4 className="text-black fw-bold mb-4">
                  ₹ {(product.price * quantity).toFixed(2)}
                </h4>

                <div className="d-flex align-items-center my-3">
                  <label className="me-3 fw-semibold">Quantity:</label>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    readOnly
                    className="form-control text-center mx-2"
                    style={{ width: "60px" }}
                    value={quantity}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleIncrement}
                  >
                    +
                  </button>
                </div>

                <div className={isMobile ? "d-grid gap-2" : "d-flex gap-2"}>
                  {isInCart ? (
                    <button
                      className="btn btn-warning"
                      style={buttonStyle}
                      onClick={() => navigate("/cartpage")}
                    >
                      View Cart
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning"
                      style={buttonStyle}
                      onClick={cartsubmit}
                    >
                      Add to Cart
                    </button>
                  )}

                  <button
                    className="btn btn-outline-dark"
                    style={buttonStyle}
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
