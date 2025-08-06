import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Menu, Popover, Drawer } from "antd"; // 🧱 Added Drawer
import { logout } from "../redux/slices/authSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { IoIosHeartEmpty } from "react-icons/io";
import { ScrollContext } from "../../src/context/ScrollContext";
import CategoryPopoverContent from "./CategoryPopoverContent";
import "../styles/newstyles.scss";
import { clearCart } from "../redux/slices/cartSlice";
import { clearWishlist } from "../redux/slices/Wishlist";

// Icons
import lucky from "../assets/images/lucky.png";
import { HiOutlineUser, HiOutlineViewList } from "react-icons/hi";

import { IoIosSearch } from "react-icons/io";
import { BsBag } from "react-icons/bs";
import { ImParagraphRight } from "react-icons/im";
import { LuScale } from "react-icons/lu";
import { MdOutlineSell } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";

const imageMap = {
  "ZERO % MAKING":
    "https://bairuha-bucket.s3.ap-south-1.amazonaws.com/luckyEcommerce/1732051669987.jpg",
  "GOLD JEWELLERY":
    "https://bairuha-bucket.s3.ap-south-1.amazonaws.com/luckyEcommerce/1708722852784.jpg",
  "DIAMOND JEWELLERY":
    "https://bairuha-bucket.s3.ap-south-1.amazonaws.com/luckyEcommerce/1707246350010.jpg",
  "LSG COLLECTION":
    "https://bairuha-bucket.s3.ap-south-1.amazonaws.com/luckyEcommerce/1708722852784.jpg",
  "COINS & BARS":
    "https://bairuha-bucket.s3.ap-south-1.amazonaws.com/luckyEcommerce/1732051102631.jpg",
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { scrollTo } = useContext(ScrollContext);

  const [masterCategories, setMasterCategories] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ SIDEBAR TOGGLE

  const { user } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/mastercategory`).then((res) => {
      setMasterCategories(res.data);
    });

    axios.get(`${API_URL}/category`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  const handleDropdownChange = (value) => scrollTo(value);
  const toLogin = () => navigate("/");
  const goToHome = () => navigate("/");

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user?._id) return;

      try {
        const res = await axios.get(`${API_URL}/cart/${user._id}`);
        setCartCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch cart count:", err);
      }
    };

    fetchCartCount();
  }, [user]);

  const userMenu = (
    <Menu>
      <Menu.Item className="fw-semibold" onClick={() => navigate("/myorders")}>
        My Orders
      </Menu.Item>
      <Menu.Item
        className="fw-bold text-danger"
        onClick={() => {
          dispatch(logout());
          dispatch(clearCart());
          dispatch(clearWishlist());
          toast.success("Logged out successfully!");
          navigate("/");
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="parentheader shadow-sm">
      {/* Header Bar */}
      <div className="header">
        <div className="header-deskbox" style={{ gap: "8px" }}>
          {/* ✅ Three-dot button for mobile */}
          <HiOutlineViewList
            size={30}
            className="firstdisplayimage d-block d-md-none"
            onClick={() => setIsSidebarOpen(true)}
            style={{ cursor: "pointer" }}
          />

          {/* ✅ Logo */}
          <img
            src={lucky}
            className="header-desklogos"
            onClick={goToHome}
            alt="logo"
          />

          {/* Desktop search dropdown */}
          <div className="header-searchbox d-none d-md-block">
            <select
              className="form-select header-inputsearch"
              onChange={(e) => handleDropdownChange(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select a section...
              </option>
              <option value="trending">Trending</option>
              <option value="banner">Banner</option>
              <option value="companies">Companies</option>
              <option value="categories">Categories</option>
              <option value="ads">Advertisement</option>
              <option value="top">Top Products</option>
              <option value="genders">Genders</option>
              <option value="goldbar">Gold Bar Offers</option>
              <option value="rate">Today's Rate</option>
            </select>
          </div>

          {/* Other icons */}
          <Link to={"/wishlist"}>
            <IoIosHeartEmpty size={25} />
          </Link>
          <Link
            style={{ color: "black", position: "relative" }}
            to={"/cartpage"}
          >
            <BsBag size={22} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-10px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: "12px",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <HiOutlineUser
                size={25}
                style={{ cursor: "pointer", marginLeft: "8px" }}
              />
            </Dropdown>
          ) : (
            <HiOutlineUser
              size={25}
              style={{ cursor: "pointer", marginLeft: "8px" }}
              onClick={toLogin}
            />
          )}
        </div>
      </div>

      {/* ✅ Mobile Sidebar Drawer for Master Categories */}
      <Drawer
        title="Categories"
        placement="left"
        onClose={() => setIsSidebarOpen(false)}
        open={isSidebarOpen}
      >
        {masterCategories.map((master) => (
          <div
            key={master._id}
            className="py-2 border-bottom"
            style={{ fontWeight: "500", cursor: "pointer" }}
            onClick={() => {
              scrollTo(master.name.toLowerCase());
              setIsSidebarOpen(false);
            }}
          >
            {master.name}
          </div>
        ))}
      </Drawer>

      {/* ✅ Desktop Master Categories */}
      <div className="header-categories d-none d-md-flex">
        {masterCategories.map((master) => {
          const relatedCategories = Categories.filter(
            (cat) => cat?.masterCategoryId?.name === master.name
          );

          return (
            <Popover
              key={master._id}
              placement="bottom"
              title={<span className="pophead">{master.name}</span>}
              content={
                <CategoryPopoverContent
                  categories={relatedCategories}
                  titleImage={imageMap[master.name]}
                  extraText={[master.description || "Explore our collection"]}
                />
              }
            >
              <div className="header-categorytext">{master.name}</div>
            </Popover>
          );
        })}
        <div className="header-sell">
          <div className="header-sellhead">
            <MdOutlineSell size={18} style={{ marginRight: "4px" }} />
            <div className="header-selltext">Sell To US</div>
          </div>
          <div className="header-sellhead">
            <IoCallOutline size={18} style={{ marginRight: "4px" }} />
            <div className="header-selltext">+971 54 581 6161</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
