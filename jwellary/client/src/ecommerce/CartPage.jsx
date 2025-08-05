import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/footer";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";
import { IoCartOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import "../styles/newstyles.scss";

import { useDispatch, useSelector } from "react-redux";
import { setCartItems, clearCart } from "../redux/slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartCount = useSelector((state) => state.cart.cartCount);
  const [totalPrice, setTotalPrice] = useState("0.00");

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please log in.");

    try {
      const res = await axios.get(`${API}/cart/${userId}`);
      dispatch(setCartItems(res.data));
      updateTotal(res.data);
    } catch (err) {
      console.log("Failed to fetch cart items:", err);
    }
  };

  const updateQuantityy = async (cartItemId, quantity) => {
    try {
      await axios.put(`${API}/cart/${cartItemId}`, { quantity });
    } catch (err) {
      toast.error("Failed to update item");
    }
  };

  const handleIncrement = async (itemId) => {
    const updatedItems = cartItems.map((item) => {
      if (item._id === itemId && item.productId) {
        const updatedQuantity = item.quantity + 1;
        updateQuantityy(itemId, updatedQuantity);
        return {
          ...item,
          quantity: updatedQuantity,
          price: (item.productId.price * updatedQuantity).toFixed(2),
        };
      }
      return item;
    });
    dispatch(setCartItems(updatedItems));
    updateTotal(updatedItems);
  };

  const handleDecrement = async (itemId) => {
    const updatedItems = cartItems.map((item) => {
      if (item._id === itemId && item.quantity > 1 && item.productId) {
        const updatedQuantity = item.quantity - 1;
        updateQuantityy(itemId, updatedQuantity);
        return {
          ...item,
          quantity: updatedQuantity,
          price: (item.productId.price * updatedQuantity).toFixed(2),
        };
      }
      return item;
    });
    dispatch(setCartItems(updatedItems));
    updateTotal(updatedItems);
  };

  const updateTotal = (items) => {
    const totalAmt = items.reduce(
      (acc, item) => acc + parseFloat(item.price || 0),
      0
    );
    setTotalPrice(totalAmt.toFixed(2));
  };

  const handledelete = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please log in.");

    const confirmDelete = window.confirm(
      "Are you sure you want to remove all items from the cart?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/cart/user/${userId}`);
      dispatch(clearCart());
      setTotalPrice("0.00");
      toast.success("Deleted");
    } catch (err) {
      console.log("Error deleting:", err);
    }
  };

  const clickdelete = async (cartItemId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/cart/${cartItemId}`);
      const updatedItems = cartItems.filter((item) => item._id !== cartItemId);
      dispatch(setCartItems(updatedItems));
      updateTotal(updatedItems);
      toast.success("Item removed from cart.");
    } catch (err) {
      toast.error("Failed to delete item.");
    }
  };

  return (
    <div>
      <Header />
      <div
        style={{ padding: "0px 115px 0px 66px" }}
        className="my-5 cartpagemain"
      >
        <div className="d-flex justify-content-between align-items-center mb-2 text-center carttxtrmv">
          <h4 className="fw-bold mb-0 carttxt">
            <IoCartOutline
              size={40}
              className="border shadow rounded p-2 mb-2 me-2 cartimg"
            />
            CART – ({cartCount})
          </h4>
          <h4
            onClick={handledelete}
            className="fw-bold mb-0 mx-auto text-danger bg-body-secondary px-4 py-1 cartrmv"
            style={{
              borderRadius: "50px",
              cursor: "pointer",
              fontSize: "17px",
            }}
          >
            Remove all items
            <TiDeleteOutline size={20} color="red" className="ms-1" />
          </h4>
        </div>

        <div className="row">
          <div className="col-md-8">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="d-flex align-items-center justify-content-between border-bottom py-3 cart2"
                >
                  <div className="d-flex align-items-center ">
                    {item.productId ? (
                      <>
                        <img
                          src={
                            item.productId?.image?.startsWith("http")
                              ? item.productId.image
                              : `https://ecommerce-jwellary-backend.onrender.com${item.productId?.image}`
                          }
                          alt={item.productId?.name}
                          className="rounded border me-3"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />

                        <div>
                          <h6 className="mb-1 fw-bold">
                            {item.productId.name}
                          </h6>
                          <p className="mb-0">
                            Unit Price: AED {item.productId.price}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-danger">Product info missing</p>
                    )}
                  </div>

                  <div className="d-flex align-items-center w-50 justify-content-end cart3">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleDecrement(item._id)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      readOnly
                      value={item.quantity}
                      className="form-control mx-2 text-center"
                      style={{ width: "50px" }}
                    />
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleIncrement(item._id)}
                    >
                      +
                    </button>
                    <div className="ms-3 fw-bold w-50 text-center">
                      AED <span style={{ fontSize: "20px" }}>{item.price}</span>
                    </div>
                    <div className="ms-3 fw-bold">
                      <MdDeleteOutline
                        size={25}
                        onClick={() => clickdelete(item._id)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
            <div className="pt-5 mb-4">
              The price and availability of items at luckystargold.com are
              subject to change. The Cart is a temporary place to store a list
              of your items and reflects each item's most recent price.
            </div>
          </div>

          <div className="col-md-4">
            <div className="fw-bold pb-2 ms-4" style={{ fontSize: "20px" }}>
              Cart Summary – ({cartCount})
            </div>
            <div className="p-4 rounded">
              <div className="d-flex justify-content-between mb-2 ">
                <span className="fw-semibold " style={{ fontSize: "19px" }}>
                  Total Product Price
                </span>
                <span className="fw-bold total1" style={{ fontSize: "25px" }}>
                  AED {totalPrice}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-semibold" style={{ fontSize: "19px" }}>
                  Discount
                </span>
                <span className="fw-bold">AED 0.00</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-semibold" style={{ fontSize: "19px" }}>
                  Tax
                </span>
                <span className="fw-bold">AED 0.00</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-semibold" style={{ fontSize: "19px" }}>
                  Delivery Charges
                </span>
                <span className="fw-bold">AED 0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 align-items-center p-3 pb-3">
                <span className="fw-semibold" style={{ fontSize: "19px" }}>
                  Total:
                </span>
                <span
                  className="text-black fw-bold total"
                  style={{ fontSize: "35px" }}
                >
                  AED {totalPrice}
                </span>
              </div>
              <hr className="pb-2" />
              <Link
                to="/checkout"
                className="btn btn-success w-100 text-start text-white fw-bold p-3"
              >
                CHECKOUT →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
