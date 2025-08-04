import React, { useEffect, useState } from "react";
import "../styles/styles.scss";
import "../styles/newstyles.scss";
import axios from "axios";

const Goldprice = () => {
  const [price, setPrice] = useState({});

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/goldprice`
        );
        setPrice(response.data);
        console.log("✅ Gold price fetched:", response.data);
      } catch (err) {
        console.error("❌ Failed to fetch gold price:", err);
      }
    };
    fetchPrice();
  }, []);
  return (
    <div className="gold-head">
      <div className="gold-title">TODAY'S RETAIL GOLD JEWELLERY PRICE</div>
      <div className="gold-date">
        {new Date().toISOString().split("T")[0]} - RATE IN AED PER GM
      </div>

      <div className="goldbox1">
        <div className="row g-1 gold2">
          <GoldRate label="Gold 24 Karat" value={price.gold24} />
          <GoldRate label="Gold 22 Karat" value={price.gold22} />
          <GoldRate label="Gold 21 Karat" value={price.gold21} />
          <GoldRate label="Gold 18 Karat" value={price.gold18} />
          <GoldRate label="Silver" value={price.silver} />
        </div>
      </div>
    </div>
  );
};

const GoldRate = ({ label, value }) => (
  <div className="goldbox col-12 col-sm-5 col-md-3 col-lg-3 col-xl-2">
    {label} -{" "}
    <span style={{ color: "rgb(184, 130, 31)", fontSize: "20px" }}>
      {value ?? "--"}
    </span>
  </div>
);

export default Goldprice;
