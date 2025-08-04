import React from "react";
import axios from "axios";
import "../styles/styles.scss";
import "../styles/newstyles.scss";
import { useEffect } from "react";
import { useState } from "react";

(<link rel="preconnect" href="https://fonts.googleapis.com" />),
  (<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />),
  (
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
      rel="stylesheet"
    />
  );

const Goldprice = () => {
  const [price, setPrice] = useState("");

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/goldprice`
        );
        const data = response.data;
        setPrice(data);
      } catch (err) {
        console.log("the api is not workingg", err);
      }
    };
    fetchPrice();
  }, []);
  console.log("this is price data", price);

  return (
    <div className="gold-head">
      <div className="gold-title">TODAY'S RETAIL GOLD JEWELLERY PRICE</div>
      <div className="gold-date">
        {new Date().toISOString().split("T")[0]} - RATE IN AED PER GM
      </div>

      <div className="goldbox1  ">
        <div className="row g-1 gold2 ">
          <div className=" goldbox  col-12 col-sm-5 col-md-3 col-lg-3 col-xl-2 ">
            Gold 24 Karat -{" "}
            <span style={{ color: "rgb(184, 130, 31)", fontSize: "20px" }}>
              {" "}
              {price.gold24}
            </span>
          </div>
          <div className=" goldbox  col-12 col-sm-5 col-md-3 col-lg-3 col-xl-2 ">
            {" "}
            Gold 22 Karat-{" "}
            <span style={{ color: "rgb(184, 130, 31)", fontSize: "20px" }}>
              {price.gold22}
            </span>{" "}
          </div>
          <div className=" goldbox col-12 col-sm-5 col-md-3 col-lg-3 col-xl-2 ">
            {" "}
            Gold 21 Karat -{" "}
            <span style={{ color: "rgb(184, 130, 31)", fontSize: "20px" }}>
              {price.gold21}
            </span>
          </div>
          <div className=" goldbox col-12 col-sm-5 col-md-11 col-lg-3 col-xl-2 ">
            Gold 18 Karat -{" "}
            <span style={{ color: "rgb(184, 130, 31)", fontSize: "20px" }}>
              {price.gold18}
            </span>
          </div>
          <div className=" goldbox col-12 col-sm-5 col-md-11 col-lg-3 col-xl-2  ">
            {" "}
            Silver -{" "}
            <span style={{ color: "rgb(184, 130, 31)", fontSize: "20px" }}>
              {price.silver}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goldprice;
