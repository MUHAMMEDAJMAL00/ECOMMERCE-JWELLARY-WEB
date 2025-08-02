import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import "../styles/styles.scss";
import "../styles/newstyles.scss";

const Banner = () => {
  const [data, setData] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/banner`);
      setData(res.data);
    } catch (err) {
      console.log("Error fetching banner data:", err);
    }
  };

  return (
    <div className="mainbanner">
      <Slider {...settings} className="custom-banner">
        {data?.map((item, index) => (
          <div key={index}>
            <div
              className="custom-banner"
              style={{
                backgroundImage: `url(${
                  item?.image.startsWith("http")
                    ? item.image
                    : `${import.meta.env.VITE_API_URL}/${item.image}`
                })`,
              }}
            >
              <div className="custom-headings">
                <div className="custom-title">
                  {item.title.includes("elegance") ? (
                    <>
                      {item.title.split("elegance")[0]} <br />
                      {item.title.split("elegance")[1]}
                    </>
                  ) : (
                    item.title
                  )}
                </div>
                <div className="custom-description">{item?.description}</div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
