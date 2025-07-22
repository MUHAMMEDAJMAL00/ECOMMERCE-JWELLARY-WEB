// src/context/ScrollContext.js
import { createContext, useRef } from "react";

export const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  const trendingRef = useRef(null);
  const bannerRef = useRef(null);
  const companiesRef = useRef(null);
  const categoriesRef = useRef(null);
  const topRef = useRef(null);
  const gendersRef = useRef(null);
  const rateRef = useRef(null);
  const adsRef = useRef(null);
  const goldbarRef = useRef(null);

  const scrollTo = (sectionName) => {
    const refs = {
      trending: trendingRef,
      banner: bannerRef,
      companies: companiesRef,
      categories: categoriesRef,
      top: topRef,
      genders: gendersRef,
      rate: rateRef,
      ads: adsRef,
      goldbar: goldbarRef,
    };
    // -------------------------------------------------------------------------------
    // refs[sectionName]?.current?.scrollIntoView({ behavior: "smooth" });
    // ------------------------------------------------------------value of scrolling toexact position

    const element = refs[sectionName]?.current;
    if (element) {
      const yOffset = -120;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <ScrollContext.Provider
      value={{
        trendingRef,
        bannerRef,
        companiesRef,
        categoriesRef,
        topRef,
        gendersRef,
        rateRef,
        adsRef,
        goldbarRef,
        scrollTo,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};
