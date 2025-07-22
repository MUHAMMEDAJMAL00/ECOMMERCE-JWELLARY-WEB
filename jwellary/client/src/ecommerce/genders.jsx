import React from "react";
import "../styles/styles.scss";
import axios from "axios";
import Slider from "react-slick";
import { useState } from "react";
import { useEffect } from "react";

const Genders = () => {
  var settings = {
    infinite: true,
    speed: 900,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1070,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 770,
        settings: {
          slidesToShow: 1.6,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await axios.get("http://localhost:3001/genders");
        const details = response.data;
        setData(details);
      } catch (err) {
        console.log("the   genders api is not workingg", err);
      }
    };
    fetchGenders();
  }, []);

  return (
    <Slider {...settings} className="genders ">
      {data.map((item, index) => (
        <div className="genders1" key={index}>
          <div
            className="genders2"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="gendertitle">{item.text}</div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Genders;
