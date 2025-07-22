import React from "react";
import Slider from "react-slick";
import "../styles/styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import mint from "../assets/images/mint.png";
import states from "../assets/images/states.png";
import pamp from "../assets/images/pamb.png";
import after from "../assets/images/after.jpeg";
import royal from "../assets/images/royal.jpeg";
import south from "../assets/images/south.jpeg";
import emirates from "../assets/images/emirates.jpeg";
import sam from "../assets/images/sam.jpeg";
import ethihad from "../assets/images/ethihad.jpeg";

const Logos = () => {
  const settings = {
    infinite: true,
    speed: 900,
    slidesToShow: 4,
    slidesToScroll: 4,
    dots: true,
    // autoplay: true,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3.4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 1070,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 360,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 4,
        },
      },
    ],
  };

  let data = [
    {
      image: mint,
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/8/8f/Valcambi_logo.svg",
    },
    {
      image:
        "https://www.perthmint.com/contentassets/30d16fe6dfe44107ac3f956b8e0bad6e/tpm-logo-125-years.svg",
    },
    {
      image: states,
    },
    {
      image:
        "https://www.emiratesgold.ae/wp-content/uploads/2022/08/header-logo.png",
    },
    {
      image: pamp,
    },
    {
      image: after,
    },
    {
      image: royal,
    },
    {
      image: south,
    },
    {
      image: emirates,
    },
    {
      image: sam,
    },
    {
      image: ethihad,
    },
  ];

  return (
    <Slider {...settings} className="logoshead ">
      {data.map((item, index) => (
        <div className="logosimagehead " key={index}>
          <div
            className="logoimg "
            style={{ backgroundImage: `url(${item.image})` }}
          ></div>
        </div>
      ))}
    </Slider>
  );
};

export default Logos;
