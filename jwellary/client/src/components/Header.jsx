// components/Header.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Menu, Popover, Drawer } from "antd";
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
import goldora from "../assets/images/goldora.png";
import { HiOutlineUser } from "react-icons/hi2";
import { IoIosSearch } from "react-icons/io";
import { BsBag } from "react-icons/bs";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";

import { ImParagraphRight } from "react-icons/im";
import { LuScale } from "react-icons/lu";
import { MdOutlineSell } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

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
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const { user } = useSelector((state) => state.auth);

  // ✅ Get API URL from .env
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch master and regular categories
  useEffect(() => {
    axios.get(`${API_URL}/mastercategory`).then((res) => {
      setMasterCategories(res.data);
    });

    axios.get(`${API_URL}/category`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  const handleDropdownChange = (value) => scrollTo(value);
  const toLogin = () => navigate("/login");
  const goToHome = () => navigate("/");

  // ✅ Fetch cart count when user changes
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

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  // Handle category expansion in mobile menu
  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Handle category navigation
  const handleCategoryNavigation = (category) => {
    // Navigate to category page using category ID or slug
    navigate(`/categorydetail/${category._id}`, {
      state: {
        categoryName: category.name,
        categoryData: category,
      },
    });
    setMobileMenuVisible(false);
    setExpandedCategory(null);
  };

  // Handle master category navigation (if needed)
  const handleMasterCategoryNavigation = (masterCategory) => {
    navigate(`/mastercategory/${masterCategory._id}`, {
      state: {
        masterCategoryName: masterCategory.name,
        masterCategoryData: masterCategory,
      },
    });
    setMobileMenuVisible(false);
    setExpandedCategory(null);
  };

  // ✅ Ant Design Dropdown menu for logged-in user
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

  // Mobile menu content
  const mobileMenuContent = (
    <div className="mobile-menu-content">
      {masterCategories.map((master) => {
        const relatedCategories = Categories.filter(
          (cat) => cat?.masterCategoryId?.name === master.name
        );
        const isExpanded = expandedCategory === master._id;

        return (
          <div key={master._id} className="mobile-menu-category">
            <div
              className="mobile-menu-master-category"
              onClick={() => {
                if (relatedCategories.length > 0) {
                  toggleCategoryExpansion(master._id);
                } else {
                  handleMasterCategoryNavigation(master);
                }
              }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 20px",
                borderBottom: "1px solid #f0f0f0",
                cursor: "pointer",
                backgroundColor: isExpanded ? "#f9f9f9" : "white",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              <span>{master.name}</span>
              {relatedCategories.length > 0 &&
                (isExpanded ? (
                  <RiArrowDropUpLine size={24} />
                ) : (
                  <RiArrowDropDownLine size={24} />
                ))}
            </div>

            {isExpanded && relatedCategories.length > 0 && (
              <div className="mobile-menu-subcategories">
                {relatedCategories.map((category) => (
                  <div
                    key={category._id}
                    className="mobile-menu-subcategory"
                    onClick={() => handleCategoryNavigation(category)}
                    style={{
                      padding: "12px 40px",
                      borderBottom: "1px solid #f5f5f5",
                      cursor: "pointer",
                      backgroundColor: "white",
                      fontSize: "14px",
                      color: "#666",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f9f9f9")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "white")
                    }
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Additional menu items */}
      <div className="mobile-menu-additional">
        <div
          className="mobile-menu-item"
          onClick={() => {
            navigate("/about");
            setMobileMenuVisible(false);
          }}
          style={{
            padding: "15px 20px",
            borderBottom: "1px solid #f0f0f0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <MdOutlineSell size={18} />
          <span>About Us</span>
        </div>

        {/* <div
          className="mobile-menu-item"
          style={{
            padding: "15px 20px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#666",
          }}
        >
          <IoCallOutline size={18} />
          <span>+971 54 581 6161</span>
        </div> */}
      </div>
    </div>
  );

  return (
    <div className="parentheader shadow-sm">
      {/* Header Bar */}
      <div className="header">
        <div className="header-deskbox" style={{ gap: "8px" }}>
          <div className="header-desklogo">
            <HiOutlineBars3BottomLeft
              size={40}
              className="firstdisplayimage"
              onClick={toggleMobileMenu}
              style={{ cursor: "pointer" }}
            />
            <img
              src={goldora}
              className="header-desklogos"
              onClick={goToHome}
              alt="logo"
            />
          </div>

          <div className="header-rate" style={{ margin: "0 8px" }}>
            <div className="textrate1">LIVE RATE</div>
            <div className="textrate2">TODAY'S PRICE</div>
          </div>

          <div className="header-searchbox" style={{ margin: "0 8px" }}>
            <div className="header-searchbar d-flex align-items-center gap-2">
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
          </div>

          <div className="header-digital" style={{ margin: "0 8px" }}>
            <div className="header-digitaltext">Digital Gold</div>
            <ImParagraphRight />
          </div>
          <div className="header-digital" style={{ margin: "0 8px" }}>
            <div className="header-digitaltext">LSG Auction</div>
            <LuScale />
          </div>

          <div className="header-cartimage" style={{ marginLeft: "8px" }}>
            <Link to={"/wishlist"}>
              <IoIosHeartEmpty size={30} color="black`" />
            </Link>
            <Link
              style={{ color: "black", position: "relative" }}
              to={"/cartpage"}
            >
              <BsBag size={25} />
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
                  size={27}
                  style={{ cursor: "pointer", marginLeft: "8px" }}
                />
              </Dropdown>
            ) : (
              <HiOutlineUser
                size={27}
                style={{ cursor: "pointer", marginLeft: "8px" }}
                onClick={toLogin}
              />
            )}
          </div>
        </div>
      </div>

      {/* Master Categories Menu with Popover */}
      <div className="header-categories">
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

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Categories"
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        bodyStyle={{ padding: 0 }}
        headerStyle={{
          borderBottom: "1px solid #f0f0f0",
          fontWeight: "600",
        }}
        width="80vw"
        style={{
          maxWidth: "320px",
        }}
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        {mobileMenuContent}
      </Drawer>
    </div>
  );
};

export default Header;
