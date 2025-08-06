import React, { useState, useEffect } from "react";
// import "./CheckoutPage.css"; // Optional for custom styles
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/footer";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems, clearCart } from "../redux/slices/cartSlice";
import { setAddress } from "../redux/slices/addressSlice";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { toast } from "react-toastify";
import "../styles/newstyles.scss";
//--------------------------------

import { useLocation } from "react-router-dom";
//--------------------------------
import { setOrder } from "../redux/slices/orderSlice";

//--------------------------------
// import MapComponent from "./MapComponent"; // Adjust path if needed

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem; //state condition from product details page when clciks buy now

  // ✅ useSelector to read cart from Redux store
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartCount = useSelector((state) => state.cart.cartCount);
  const [totalPrice, setTotalPrice] = useState(0);
  const [saving, setSaving] = useState(false);
  const userId = useSelector((state) => state.auth.userId); // ✅ Valid place

  //------------------------------------------------------------------------------------
  const [showAddressForm, setShowAddressForm] = useState(false); //for showing address
  const [savedAddresses, setSavedAddresses] = useState([]); //for saved address showing
  const [selectedAddressId, setSelectedAddressId] = useState(null); //for selecting which address to deliver
  const [isAddingNew, setIsAddingNew] = useState(false); // Track if adding new address
  const [viewOnly, setViewOnly] = useState(false); // view-only form if an address is selected

  //------------------------------------------------------------------------------------

  const [formData, setFormData] = useState({
    name: "", // ADD THIS LINE
    location: "",
    addressType: "Home",
    flat: "",
    poBox: "",
    street: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    fullAddress: "",
    paymentMethod: "Pay Online",
  });

  useEffect(() => {
    if (buyNowItem) {
      setTotalPrice(buyNowItem.price * buyNowItem.qty);
    } else {
      fetchCartItems();
    }

    fetchSavedAddresses();
  }, []);

  // const users = useSelector((state) => state.auth.userId);
  const BASE_URL = "https://ecommerce-jwellary-backend.onrender.com";

  const fetchCartItems = async () => {
    const userId = user?._id;
    if (!userId) return alert("Please log in.");

    try {
      const res = await axios.get(`${BASE_URL}/cart/${userId}`);
      // ✅ Update Redux state
      dispatch(setCartItems(res.data));
      updateTotal(res.data);
    } catch (err) {
      console.log("Failed to fetch cart items:", err);
    }
  };

  //-------------------------------------------------------------------------
  const user = useSelector((state) => state.auth.user);

  const fetchSavedAddresses = async () => {
    try {
      const userId = user?._id;
      if (!userId) return;

      const res = await axios.get(`${BASE_URL}/address/${userId}`);
      setSavedAddresses(res.data); // store in state
    } catch (err) {
      console.error("Error fetching saved addresses", err);
    }
  };

  //---------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //-------------------------------------------------------------------
  const placeOrder = async () => {
    const selectedAddress = savedAddresses.find(
      (addr) => addr._id === selectedAddressId
    );
    if (!selectedAddress) {
      return alert("Please select a delivery address.");
    }

    let items = [];
    if (buyNowItem) {
      items = [
        {
          name: buyNowItem.name,
          productId: buyNowItem.productId,
          qty: buyNowItem.qty,
          price: buyNowItem.price,
        },
      ];
    } else if (cartItems && cartItems.length > 0) {
      items = cartItems.map((item) => ({
        name: item.productId.name,
        productId: item.productId._id,
        qty: item.quantity,
        price: item.productId.price,
      }));
    } else {
      return alert(
        "No items to order. Please add items to your cart or use Buy Now."
      );
    }

    const orderData = {
      user: user._id,
      address: {
        ...selectedAddress,
        email: user.email,
        paymentMethod: formData.paymentMethod,
      },
      paymentMethod: formData.paymentMethod,
      totalPrice: Number(totalPrice), // ✅ FIX HERE
      items: buyNowItem
        ? [
            {
              name: buyNowItem.name,
              productId: buyNowItem.productId,
              qty: Number(buyNowItem.qty), // ✅ FIX HERE
              price: Number(buyNowItem.price), // ✅ FIX HERE
            },
          ]
        : cartItems.map((item) => ({
            name: item.productId.name,
            productId: item.productId._id,
            qty: Number(item.quantity), // ✅ FIX HERE
            price: Number(item.productId.price), // ✅ FIX HERE
          })),
    };

    if (formData.paymentMethod === "Pay Online") {
      try {
        const res = await axios.post(`${BASE_URL}/create-order`, {
          amount: totalPrice,
        });

        const { id: razorpayOrderId } = res.data;

        const options = {
          key: "rzp_test_Wsj59hTGf0eyZo", // Replace with production key for live
          amount: totalPrice * 100,
          currency: "INR",
          name: "Your Store Name",
          description: "Order Payment",
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              orderData.razorpayPaymentId = response.razorpay_payment_id;

              const finalOrder = await axios.post(
                `${BASE_URL}/orders`,
                orderData
              );
              console.log("Final orderData to be sent:", orderData);

              dispatch(setOrder(finalOrder.data));
              await axios.delete(`${BASE_URL}/cart/user/${user._id}`);
              dispatch(clearCart());
              localStorage.removeItem("cartItems");
              toast.success("Order placed successfully!");
              navigate("/success", { state: { order: finalOrder.data } });
            } catch (err) {
              console.error("Order placement failed:", err);
              alert("Failed to save order after payment");
            }
          },
          prefill: {
            name: user.name || "Customer",
            email: user.email || "example@example.com",
            contact: formData.phone || "",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error("Razorpay order creation failed:", err);
        alert("Payment failed. Try again.");
      }

      return;
    }

    // COD or Other Payment Methods
    try {
      const response = await axios.post(`${BASE_URL}/orders`, orderData);
      const placedOrder = response.data;

      dispatch(setOrder(placedOrder));
      await axios.delete(`${BASE_URL}/cart/user/${user._id}`);
      dispatch(clearCart());
      localStorage.removeItem("cartItems");
      toast.success("Order placed successfully!");
      navigate("/success", { state: { order: placedOrder } });
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Failed to place order");
    }
  };

  //------------------------------------------------------
  const updateTotal = (items) => {
    const totalAmt = items.reduce(
      (acc, item) => acc + parseFloat(item.price || 0),
      0
    );
    setTotalPrice(totalAmt.toFixed(2));
  };

  const handleCancel = () => {
    setShowAddressForm(false);
    setIsAddingNew(false);
    setViewOnly(false);
    // Reset form data
    setFormData({
      name: "", // RESET NAME HERE
      location: "",
      addressType: "Home",
      flat: "",
      poBox: "",
      street: "",
      city: "",
      state: "",
      country: "",
      phone: "",
      fullAddress: "",
      paymentMethod: formData.paymentMethod, // Keep payment method
    });
    console.log("Cancel clicked");
  };

  const handleSave = async () => {
    if (!user || !user._id) {
      alert("Please log in.");
      return;
    }

    const addressData = {
      ...formData,
      user: user._id,
    };

    console.log("Sending address data:", addressData);

    try {
      setSaving(true);
      const res = await axios.post(`${BASE_URL}/address`, addressData);
      alert("Address saved successfully!");
      dispatch(setAddress(res.data));
      setShowAddressForm(false);
      setIsAddingNew(false);
      setViewOnly(false);
      fetchSavedAddresses();
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Error saving address.");
    } finally {
      setSaving(false);
    }
  };

  const handledelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/address/${id}`);
      setSavedAddresses((prev) => prev.filter((addr) => addr._id !== id));

      // If the deleted address was selected, clear selection
      if (selectedAddressId === id) {
        setSelectedAddressId(null);
        setShowAddressForm(false);
        setViewOnly(false);
      }
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  //-----------------------------------------------------------------------for update
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAddressData, setEditAddressData] = useState(null);

  // Function to handle "Add New Address" button click
  const handleAddNewAddress = () => {
    // Check if user already has 2 addresses and trying to add new
    if (!showAddressForm && savedAddresses.length >= 2) {
      alert(
        "You can only save up to 2 addresses. You can edit current addresses."
      );
      return;
    }

    // If currently showing form, hide it
    if (showAddressForm) {
      setShowAddressForm(false);
      setIsAddingNew(false);
      setViewOnly(false);
      return;
    }

    // Reset form for new address
    setFormData({
      name: "", // RESET NAME HERE FOR NEW ADDRESS
      location: "",
      addressType: "Home",
      flat: "",
      poBox: "",
      street: "",
      city: "",
      state: "",
      country: "",
      phone: "",
      fullAddress: "",
      paymentMethod: formData.paymentMethod,
    });

    setIsAddingNew(true);
    setViewOnly(false);
    setShowAddressForm(true);
  };

  // Function to handle address selection (radio button click)
  const handleAddressSelect = (address) => {
    setSelectedAddressId(address._id);

    // Populate form with selected address data
    setFormData({
      name: address.name || "", // SET NAME FROM SELECTED ADDRESS
      location: address.location || "",
      addressType: address.addressType || "Home",
      flat: address.flat || "",
      poBox: address.poBox || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "",
      phone: address.phone || "",
      fullAddress: address.fullAddress || "",
      paymentMethod: formData.paymentMethod,
    });

    setShowAddressForm(true);
    setViewOnly(true);
    setIsAddingNew(false);
  };
  // -------------------------------------------location

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await axios.get(`${BASE_URL}/api/reverse-geocode`, {
            params: {
              lat: latitude,
              lon: longitude,
            },
          });

          const address = res.data.address;

          setFormData((prev) => ({
            ...prev,
            location: res.data.display_name || "",
            city: address.city || address.town || address.village || "",
            state: address.state || "",
            country: address.country || "",
          }));
        } catch (err) {
          console.error("Error in reverse geocoding:", err);
          alert("Failed to fetch address from location.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get your location.");
      }
    );
  };

  return (
    <div>
      <Header />

      {/* Edit modal */}
      {showEditModal && (
        <div
          className="modal d-block pt-5"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content p-4">
              <h5 className="fw-bold">Edit Address</h5>
              <div className="form-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name" // ADDED FOR EDIT MODAL
                  value={editAddressData?.name || ""}
                  onChange={(e) =>
                    setEditAddressData({
                      ...editAddressData,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Flat / Room"
                  value={editAddressData?.flat || ""}
                  onChange={(e) =>
                    setEditAddressData({
                      ...editAddressData,
                      flat: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Address"
                  value={editAddressData?.fullAddress || ""}
                  onChange={(e) =>
                    setEditAddressData({
                      ...editAddressData,
                      fullAddress: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Street"
                  value={editAddressData?.street || ""}
                  onChange={(e) =>
                    setEditAddressData({
                      ...editAddressData,
                      street: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="City"
                  value={editAddressData?.city || ""}
                  onChange={(e) =>
                    setEditAddressData({
                      ...editAddressData,
                      city: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone"
                  value={editAddressData?.phone || ""}
                  onChange={(e) =>
                    setEditAddressData({
                      ...editAddressData,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={async () => {
                    try {
                      await axios.put(
                        `https://ecommerce-jwellary-backend.onrender.com/address/${editAddressData._id}`,
                        editAddressData
                      );
                      alert("Address updated!");
                      setShowEditModal(false);
                      fetchSavedAddresses(); // refresh list
                    } catch (err) {
                      alert("Failed to update");
                    }
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        style={{ padding: "0px 95px 0px 90px" }}
        className="my-4 checkoutmain"
      >
        <div className="row">
          {/* LEFT: Address & Payment */}
          <div className="col-md-7 pe-5">
            {/* Header & "Add New Address" button */}
            <div className="d-flex justify-content-between">
              <h4 className="fw-bold delivery">📍 DELIVERY ADDRESS</h4>
              <h4
                style={{
                  fontSize: "18px",
                  borderRadius: "100px",
                  cursor: "pointer",
                }}
                className="fw-semibold shadow bg-light text-center px-4 py-2 address"
                onClick={handleAddNewAddress}
              >
                {showAddressForm ? "Show Saved Addresses" : "Add New Address"}
              </h4>
            </div>
            <hr />

            {/* 2-Column Layout with Radio Buttons - only show if not adding new address */}
            {!showAddressForm && (
              <div className="row">
                {savedAddresses.map((address, index) => (
                  <div className="col-md-6" key={address._id}>
                    <div
                      style={{ cursor: "pointer" }}
                      className={`border p-3 rounded d-block mb-3 position-relative ${
                        selectedAddressId === address._id
                          ? "border-success bg-white"
                          : "bg-light"
                      }`}
                      onClick={() => handleAddressSelect(address)}
                    >
                      {/* Edit and Delete icons */}
                      <div className="position-absolute top-0 end-0 p-2">
                        <MdOutlineEdit
                          size={20}
                          style={{ cursor: "pointer" }}
                          className="text-primary me-2"
                          onClick={(e) => {
                            e.stopPropagation(); // ✅ Prevent parent click
                            setEditAddressData(address);
                            setShowEditModal(true);
                          }}
                        />
                        <MdDeleteOutline
                          size={20}
                          style={{ cursor: "pointer" }}
                          className="text-danger"
                          onClick={(e) => {
                            e.stopPropagation(); // ✅ Prevent parent click
                            if (
                              window.confirm(
                                "Are you sure you want to delete this address?"
                              )
                            ) {
                              handledelete(address._id);
                            }
                          }}
                        />
                      </div>
                      {/* Radio button */}
                      <input
                        type="radio"
                        id={`address-${index}`}
                        name="selectedAddress"
                        value={address._id}
                        checked={selectedAddressId === address._id}
                        onChange={() => handleAddressSelect(address)}
                        className="me-2"
                      />
                      {/* Address details */}
                      <div className="fw-bold text-capitalize text-secondary">
                        {address.addressType}
                      </div>
                      <div className="fw-bold">{address.name}</div>{" "}
                      {/* DISPLAY NAME HERE */}
                      <div className="fw-bold">{address.flat}</div>
                      <div className="text-muted">
                        {address.fullAddress}, {address.street}, {address.city},{" "}
                        {address.state}, {address.country}, {address.poBox}
                      </div>
                      <div className="fw-semibold mt-1 text-dark">
                        {address.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Show Address Input Form */}
            {showAddressForm && (
              <>
                {/* ADDED: Row for Name */}
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="name" className="text-secondary">
                      Full Name
                    </label>
                    <input
                      className="form-control p-2"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={viewOnly}
                    />
                  </div>
                </div>

                {/* Row 1: Search Location */}
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="location" className="text-secondary">
                      Search Location
                    </label>
                    <input
                      className="form-control p-2"
                      id="location"
                      name="location"
                      placeholder="Search Location"
                      value={formData.location}
                      onChange={handleChange}
                      onClick={getCurrentLocation}
                      disabled={viewOnly}
                    />
                  </div>
                </div>

                {/* Row 2: Address Type + Flat */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="addressType" className="text-secondary">
                      Address Type
                    </label>
                    <select
                      className="form-control p-2"
                      id="addressType"
                      name="addressType"
                      value={formData.addressType}
                      onChange={handleChange}
                      disabled={viewOnly}
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="flat" className="text-secondary">
                      Home / Flat / Room
                    </label>
                    <input
                      className="form-control p-2"
                      id="flat"
                      placeholder="Home or Flat/room"
                      name="flat"
                      value={formData.flat}
                      onChange={handleChange}
                      disabled={viewOnly}
                    />
                  </div>
                </div>

                {/* Row 3: Full Address + PO Box + Street */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="fullAddress" className="text-secondary">
                      Full Address
                    </label>
                    <textarea
                      className="form-control p-2"
                      id="fullAddress"
                      placeholder="Full Address"
                      name="fullAddress"
                      rows="4"
                      value={formData.fullAddress}
                      onChange={handleChange}
                      disabled={viewOnly}
                    ></textarea>
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="poBox" className="text-secondary">
                      PO Box
                    </label>
                    <input
                      className="form-control p-2"
                      id="poBox"
                      placeholder="PO Box"
                      name="poBox"
                      value={formData.poBox}
                      onChange={handleChange}
                      disabled={viewOnly}
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="street" className="text-secondary">
                      Street
                    </label>
                    <input
                      className="form-control p-2"
                      id="street"
                      placeholder="Street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      disabled={viewOnly}
                    />
                  </div>
                </div>

                {/* Row 4: City + State */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="city" className="text-secondary">
                      City
                    </label>
                    <input
                      className="form-control p-2"
                      id="city"
                      placeholder="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={viewOnly}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="state" className="text-secondary">
                      State
                    </label>
                    <input
                      className="form-control p-2"
                      id="state"
                      placeholder="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={viewOnly}
                    />
                  </div>
                </div>

                {/* Row 5: Country + Phone */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="country" className="text-secondary">
                      Country
                    </label>
                    <input
                      className="form-control p-2"
                      id="country"
                      placeholder="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      disabled={viewOnly}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="text-secondary">
                      Phone Number
                    </label>
                    <input
                      className="form-control p-2"
                      id="phone"
                      placeholder="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={viewOnly}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="row mt-4">
                  {viewOnly ? (
                    // View mode - only show Close button
                    <div className="col-md-12">
                      <button
                        type="button"
                        className="btn btn-secondary w-100 p-3"
                        onClick={handleCancel}
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    // Edit mode - show Cancel and Save buttons
                    <>
                      <div className="col-md-6">
                        <button
                          type="button"
                          className="btn border border-danger text-danger w-100 p-3"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button
                          type="submit"
                          className="btn btn-success w-100 p-3 text-white fw-bold"
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* PAYMENT METHOD -- always visible */}
            <h4 className="mt-4 fw-bold">💳 PAYMENT METHOD</h4>
            <hr />
            {[
              "Pay Online",
              "Cash On Delivery (COD)",
              "Pick From Shop",
              "Bank Transfer",
            ].map((method) => (
              <div
                key={method}
                className={`form-check mb-2 border rounded d-flex align-items-center  ${
                  formData.paymentMethod === method ? "bg-white" : "bg-light"
                }`}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleChange({
                    target: { name: "paymentMethod", value: method },
                  })
                }
              >
                <input
                  className="form-check-input me-2"
                  type="radio"
                  value={method}
                  checked={formData.paymentMethod === method}
                  name="paymentMethod"
                  onChange={handleChange}
                  id={method}
                  style={{ cursor: "pointer", marginLeft: "1px" }}
                />
                <label
                  className="form-check-label text-black fw-bold  mb-0 p-3"
                  htmlFor={method}
                  style={{ cursor: "pointer" }}
                >
                  {method}
                </label>
              </div>
            ))}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="col-md-5 mt-3 pe-5">
            <div
              className="fw-bold d-flex justify-content-between align-items-center ms-2"
              style={{ fontSize: "20px" }}
            >
              Checkout Summary
              <div style={{ fontSize: "15px" }} className="text-secondary ">
                {cartCount}
                <span className="text-secondary ">items</span>
              </div>
            </div>
            <hr />
            <div className="checkoutsummary">
              {buyNowItem ? (
                <div className="d-flex align-items-center justify-content-between border-bottom py-3">
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        buyNowItem.image?.startsWith("http")
                          ? buyNowItem.image
                          : buyNowItem.image?.startsWith("/uploads")
                          ? `https://ecommerce-jwellary-backend.onrender.com${buyNowItem.image}`
                          : `https://ecommerce-jwellary-backend.onrender.com/uploads/${buyNowItem.image}`
                      }
                      alt={buyNowItem.name}
                      className="rounded border me-3"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />

                    <div>
                      <h6 className="mb-1 fw-bold">{buyNowItem.name}</h6>
                      <p className="mb-0 text-secondary">
                        Unit Price:
                        <span className="text-black fw-semibold ms-2">
                          {buyNowItem.price} x {buyNowItem.qty}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div style={{ fontSize: "21px" }} className="fw-bold">
                    <span
                      style={{ fontSize: "15px" }}
                      className="text-secondary fw-small p-2"
                    >
                      AED
                    </span>
                    {(buyNowItem.price * buyNowItem.qty).toFixed(2)}
                  </div>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex align-items-center justify-content-between border-bottom py-3"
                  >
                    <div className="d-flex align-items-center">
                      {item.productId ? (
                        <>
                          <img
                            src={`https://ecommerce-jwellary-backend.onrender.com${item.productId.image}`}
                            alt={item.productId.name}
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
                            <p className="mb-0 text-secondary">
                              Unit Price:
                              <span className="text-black fw-semibold ms-2">
                                {item.productId.price} x {item.quantity}
                              </span>
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="text-danger">Product info missing</p>
                      )}
                    </div>
                    <div
                      style={{ fontSize: "21px" }}
                      className="fw-bold aedsize"
                    >
                      <span
                        style={{ fontSize: "15px" }}
                        className="text-secondary fw-small p-2"
                      >
                        AED
                      </span>
                      {item.price}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 ">
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-sm fonttext" style={{ fontSize: "19px" }}>
                  Total Product Price
                </span>
                <span className="fw-bold " style={{ fontSize: "25px" }}>
                  AED {totalPrice}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-sm fonttext" style={{ fontSize: "19px" }}>
                  Discount
                </span>
                <span className="fw-bold fonttext">AED 0.00</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-sm fonttext" style={{ fontSize: "19px" }}>
                  Tax
                </span>
                <span className="fw-bold fonttext">AED 0.00</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-sm fonttext" style={{ fontSize: "19px" }}>
                  Delivery Charges
                </span>
                <span className="fw-bold fonttext">AED 0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 align-items-center p-3 pb-3 totalorder">
                <span className="fw-sm " style={{ fontSize: "19px" }}>
                  Total:
                </span>
                <span
                  className="text-black fw-bold mainaed"
                  style={{ fontSize: "35px" }}
                >
                  AED {totalPrice}
                </span>
              </div>
              <hr className="pb-2" />
              <button
                className="btn btn-success w-100 text-start text-white fw-bold p-3"
                onClick={placeOrder}
              >
                PLACE ORDER →
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
