import React, { useEffect, useState } from "react";
import "../styles/styles.scss";
import "../styles/newstyles.scss";
import axios from "axios";
import Slider from "react-slick";
import { Link } from "react-router-dom";

const Goldinformation = () => {
  const [Data, setData] = useState([]);

  const settings = {
    infinite: true,
    speed: 900,
    slidesToShow: 3.6,
    slidesToScroll: 2,
    autoplay: true,
    arrows: true,
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
          slidesToShow: 3.1,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 2.1,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          infinite: true,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchGoldad = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/goldad`
        );
        setData(response.data);
      } catch (err) {
        console.log("Gold ad API error:", err);
      }
    };
    fetchGoldad();
  }, []);

  return (
    <Slider {...settings} className="slick-sliders">
      {Data.map((item, index) => {
        const imageUrl = item?.image?.startsWith("http")
          ? item.image
          : `${import.meta.env.VITE_API_URL}/${item.image}`;

        return (
          <div key={index} className="exclusiv1">
            <div
              className="exclusivegold"
              style={{
                backgroundImage: `url(${imageUrl})`,
                textWrap: "nowrap",
              }}
            >
              <div className="exclusivetitle">{item.text}</div>
              <div className="exclusivedesc">{item.description}</div>
              <Link
                style={{ textDecoration: "none", fontSize: "15px" }}
                className="text-primary"
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
