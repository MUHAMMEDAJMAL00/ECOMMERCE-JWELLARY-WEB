import React, { useContext } from "react";
import Banner from "../ecommerce/Banner";
import Categories from "../ecommerce/categories";
import Genders from "../ecommerce/genders";
import GoldInformation from "../ecommerce/goldinformation";
import Logos from "../ecommerce/logos";
import TopModels from "../ecommerce/topmodels";
import Trending from "../ecommerce/trending";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/styles.scss";
import Header from "../components/Header";
import Footer from "../components/footer";
import Photosection from "../ecommerce/photosection";
import { ScrollContext } from "../context/ScrollContext";
import Goldprice from "../ecommerce/goldprice";

const Shop = () => {
  const {
    trendingRef,
    bannerRef,
    companiesRef,
    categoriesRef,
    topRef,
    gendersRef,
    rateRef,
    adsRef,
    goldbarRef,
  } = useContext(ScrollContext);

  return (
    <>
      <Header />
      <div ref={bannerRef}>
        <Banner />
      </div>
      <div ref={categoriesRef}>
        <Categories />
      </div>
      <div ref={rateRef}>
        <Goldprice />
      </div>
      <div ref={adsRef}>
        <Photosection />
      </div>

      <div ref={goldbarRef}>
        <GoldInformation />
      </div>
      <div ref={topRef}>
        <TopModels />
      </div>
      <div ref={gendersRef}>
        <Genders />
      </div>
      <div ref={trendingRef}>
        <Trending />
      </div>
      <div ref={companiesRef}>
        <Logos />
      </div>
      <Footer />
    </>
  );
};

export default Shop;
