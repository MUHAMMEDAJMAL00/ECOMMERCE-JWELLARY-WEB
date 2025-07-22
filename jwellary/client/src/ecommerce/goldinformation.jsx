import React from "react";
import "../styles/styles.scss";
import axios from "axios";
import Slider from "react-slick";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Goldinformation = () => {
  var settings = {
    infinite: true,
    speed: 900,
    slidesToShow: 3.6,
    slidesToScroll: 2,
    autoplay: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 3.1,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
    ],
  };

  const [Data, setData] = useState([]);
  useEffect(() => {
    const fetchGoldad = async () => {
      try {
        const response = await axios.get("http://localhost:3001/goldad");
        const details = response.data;
        setData(details);
      } catch (err) {
        console.log("the Goldadapi is not workingg", err);
      }
    };
    fetchGoldad();
  }, []);
  // console.log("this goldad dataaaa", Data);
  return (
    <Slider {...settings} className="slick-sliders">
      {Data.map((item, index) => {
        return (
          <div key={index} className="exclusiv1 h-100">
            <div
              className="exclusivegold"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="exclusivetitle">{item.text}</div>
              <div className="exclusivedesc">{item.description}</div>
              <Link
                style={{ textDecoration: "none" }}
                className="text-primary "
                to={`/categorydetail/${item.categoryId}`}
              >
                See More...
              </Link>
            </div>
          </div>
        );
      })}
    </Slider>
  );
};

export default Goldinformation;
