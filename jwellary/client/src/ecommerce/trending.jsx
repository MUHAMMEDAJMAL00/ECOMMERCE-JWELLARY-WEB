import React, { useEffect, useState } from "react";
import "../styles/styles.scss";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoIosHeartEmpty, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../redux/slices/Wishlist";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/styles.scss";
import { FaArrowRight } from "react-icons/fa6";
// Custom Arrow Components
const PrevArrow = ({ onClick }) => (
  <div className="slick-arrow slick-prev" onClick={onClick}>
    <FaArrowRight size={20} />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div className="slick-arrow slick-next " onClick={onClick}>
    <IoIosArrowForward size={20} />
  </div>
);

const Trending = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/products/trending"
        );
        setData(response.data);
      } catch (err) {
        console.log("error trendingggg", err);
      }
    };
    fetchTrending();
  }, []);

  const addToWishlists = (product) => {
    if (!user?._id) return alert("Please login first");

    dispatch(
      addToWishlist({
        userId: user._id,
        productId: product._id,
        price: product.price,
        aed: product.aed,
      })
    )
      .then(() => {
        toast.success("Added to wishlist!");
      })
      .catch(() => {
        toast.error("Failed to add to wishlist.");
      });
  };

  const settings = {
    infinite: true,
    speed: 900,
    slidesToShow: 4.6,
    slidesToScroll: 4,
    autoplay: true,
    arrows: true,
    dots: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3.5, slidesToScroll: 4 } },
      { breakpoint: 950, settings: { slidesToShow: 3.2, slidesToScroll: 4 } },
      { breakpoint: 630, settings: { slidesToShow: 2.2, slidesToScroll: 4 } },
      { breakpoint: 450, settings: { slidesToShow: 1.1, slidesToScroll: 4 } },
    ],
  };

  return (
    <div className="stocks">
      <div className="toptext">Trending Now</div>
      <Slider {...settings} className="stockslider">
        {data.map((item, index) => (
          <div key={index} className="mainstocks">
            <div className="text-end" style={{ position: "relative" }}>
              <IoIosHeartEmpty
                size={25}
                style={{
                  position: "absolute",
                  right: "35px",
                  top: "10px",
                  cursor: "pointer",
                  zIndex: 2,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  addToWishlists(item);
                }}
              />
            </div>

            <Link
              to={`/productdetail/${item._id}`}
              className="category-link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                className="stockimages"
                src={`http://localhost:3001${item.image}`}
                alt={item.name}
              />
              <div className="productss ps-3">
                <div className="stocktitle">{item.title}</div>
                <div className="stocktitle">{item.name}</div>
                <div className="stockaed">{item.aed}</div>
                <div className="stockaed">₹{item.price}</div>
                <div className="availablestock">{item.stock}</div>
                <div className="availablestocks">{item.stocks}</div>
                <div className="availablerating">{item.rating}</div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Trending;
