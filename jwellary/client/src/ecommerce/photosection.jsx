import React, { useEffect, useState } from "react";
import "../styles/newstyles.scss";
import "../styles/styles.scss";
import axios from "axios";

const Photosection = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/adsection`
        );
        setData(response.data);
      } catch (err) {
        console.error("❌ Error fetching ad section:", err);
      }
    };
    fetchSection();
  }, []);

  return (
    <div className="golds">
      {data.map((item, index) => {
        const words = item.text.split(" ");
        const line1 = words.slice(0, 5).join(" ");
        const line2 = words.slice(5, 10).join(" ");
        const line3 = words.slice(10).join(" ");

        return (
          <div key={index} className="sections">
            <div
              className="section1"
              style={{
                backgroundImage: `url(${
                  item?.image?.startsWith("http")
                    ? item.image
                    : `${import.meta.env.VITE_API_URL}/${item.image}`
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="sectiontitle">
                {line1}
                <br />
                {line2}
                <br />
                {line3}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Photosection;
