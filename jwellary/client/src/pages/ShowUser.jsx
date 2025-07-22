import React from "react";
import MyNavbar from "../pages/MyNavbar";

const ShowUser = () => {
  return (
    <div>
      <MyNavbar />

      <div
        className="background"
        style={{
          backgroundImage: `Url(
          "https://images.pexels.com/photos/19285776/pexels-photo-19285776.jpeg?cs=srgb&dl=pexels-john-tekeridis-21837-19285776.jpg&fm=jpg"
        )`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "90vh",
        }}
      ></div>
    </div>
  );
};

export default ShowUser;
