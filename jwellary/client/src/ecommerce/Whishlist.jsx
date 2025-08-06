import axios from "axios";
import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useDispatch, useSelector } from "react-redux";
import "../styles/newstyles.scss";
import Header from "../components/Header";
import Footer from "../components/footer";
import { toast } from "react-toastify";

// Redux actions
import { fetchWishlist, removeFromWishlist } from "../redux/slices/Wishlist";
import {
  fetchCart,
  addToCartAsync,
  deleteCartItem,
} from "../redux/slices/cartSlice";

const BASE_URL = "https://ecommerce-jwellary-backend.onrender.com";

const Whislist = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const { items: savedWishlist, loading } = useSelector(
    (state) => state.wishlist
  );

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishlist(user._id));
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, user]);

  const handleDelete = (itemId) => {
    dispatch(removeFromWishlist(itemId));
    toast.info("Item removed from wishlist.");
  };

  const handleAddToCart = async (item) => {
    if (!user?._id) {
      toast.error("Please log in to add items to cart.");
      return;
    }

    const alreadyInCart = cartItems.some(
      (cartItem) => cartItem.productId === item.productId._id
    );

    if (alreadyInCart) {
      toast.info("This item is already in your cart.");
      return;
    }

    try {
      await dispatch(
        addToCartAsync({
          userId: user._id,
          productId: item.productId._id,
          quantity: 1,
          price: item.price,
        })
      ).unwrap();

      toast.success("Item added to cart!");
      dispatch(removeFromWishlist(item._id));
      toast.info("Item removed from wishlist.");
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div style={{ width: "100%" }} className="wishlist-container px-5 py-4">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#a38147" }}>
          My Wishlist
        </h2>
        <hr
          style={{
            borderTop: "2px solid #d4af37",
            width: "80px",
            margin: "0 auto 30px",
          }}
        />

        <div className="d-flex flex-wrap gap-4 justify-content-center ">
          {savedWishlist.length === 0 ? (
            <p className="text-muted fs-5">Your wishlist is empty.</p>
          ) : (
            savedWishlist.map((item) => (
              <Card
                key={item._id}
                className="shadow rounded-4 border-3 d-flex flex-column wish"
                style={{
                  width: "18rem",
                  backgroundColor: "#fffaf5",
                  border: "1px solid #f0e6d2",
                  display: "flex",
                  justifyContent: "space-between",
                  minHeight: "450px",
                }}
              >
                <Card.Img
                  variant="top"
                  src={
                    item.productId?.image?.startsWith("http")
                      ? item.productId?.image
                      : `${BASE_URL}/${item.productId?.image}`
                  }
                />

                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title
                      className="fw-semibold text-center mb-2"
                      style={{
                        fontSize: "16px",
                        color: "#a38147",
                        height: "40px",
                        overflow: "hidden",
                      }}
                    >
                      {item.productId?.name}
                    </Card.Title>

                    <Card.Text
                      className="text-muted"
                      style={{
                        fontSize: "14px",
                        maxHeight: "65px",
                        overflow: "hidden",
                      }}
                    >
                      {item.productId?.description}
                    </Card.Text>

                    <Card.Text
                      className="text-center"
                      style={{
                        color: "#d4af37",
                        fontWeight: "bold",
                        fontSize: "15px",
                      }}
                    >
                      ₹{item.price}
                    </Card.Text>
                  </div>

                  <div className="mt-3 d-flex flex-column gap-2">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="w-100"
                      style={{ borderRadius: "20px", fontWeight: "500" }}
                      onClick={() => handleDelete(item._id)}
                    >
                      Remove
                    </Button>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="w-100"
                      style={{ borderRadius: "20px", fontWeight: "500" }}
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Whislist;
