import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { GiArrowScope } from "react-icons/gi";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/styles.scss";
import "../styles/newstyles.scss";

function Categories() {
  const [data, setdata] = useState([]);
  const settings = {
    infinite: true,
    speed: 900,
    slidesToShow: 10,
    slidesToScroll: 3,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1460,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 3,
          infinite: true,
          // dots: true
        },
      },
      {
        breakpoint: 1182,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 3,
          infinite: true,
          // dots: true
        },
      },
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: true,
          // dots: true
        },
      },
      {
        breakpoint: 875,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: true,
          // dots: true
        },
      },
      {
        breakpoint: 763,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: true,
          // dots: true
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          infinite: true,
          // dots: true
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 4.3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 395,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
    ],
  };

  useEffect(() => {
    fetchcategory();
  }, []);

  const fetchcategory = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/category`);
      // console.log("consolinggg the ", res);
      setdata(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="slider-container ">
      <Slider {...settings}>
        {data?.map((item, index) => (
          <Link
            to={`/categorydetail/${item._id}`}
            key={index}
            className="category-link"
          >
            <div className="slidder">
              <div
                className="cat1"
                style={{
                  backgroundImage: `url(${
                    item?.image?.startsWith("http")
                      ? item.image
                      : `${import.meta.env.VITE_API_URL}/${item.image}`
                  })`,
                  backgroundSize: "contain",
                }}
              ></div>

              <div className="slider-title">
                <div className="slider-title">{item?.name}</div>
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
}

export default Categories;
