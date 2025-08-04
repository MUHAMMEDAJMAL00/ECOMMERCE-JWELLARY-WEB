import React, { useEffect, useState } from "react";
import "../styles/styles.scss";
import "../styles/newstyles.scss";
import axios from "axios";
import Slider from "react-slick";

const Genders = () => {
  const settings = {
    infinite: true,
    speed: 900,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    arrows: true,
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
          slidesToShow: 2.2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/genders`
        );
        setData(response.data);
      } catch (err) {
        console.log("the genders api is not working", err);
      }
    };
    fetchGenders();
  }, []);

  return (
    <div className="gendersmain">
      <Slider {...settings} className="genders h-100 mb-3">
        {data.map((item, index) => (
          <div className="genders1" key={index}>
            <div
              className="genders2"
              style={{
                backgroundImage: `url(${
                  item.image?.startsWith("http")
                    ? item.image
                    : `${import.meta.env.VITE_API_URL}/${item.image}`
                })`,
              }}
            >
              <div className="gendertitle">{item.text}</div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Genders;
