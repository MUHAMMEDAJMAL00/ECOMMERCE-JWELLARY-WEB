import { useLocation } from "react-router-dom";
import Trending from "../ecommerce/trending";
import TopProducts from "../ecommerce/TopModels";
import Genders from "../ecommerce/genders";
import Goldprice from "../ecommerce/goldprice";
import Categories from "../ecommerce/categories";
import Banner from "../ecommerce/Banner";
import Logos from "../ecommerce/logos";

function SectionPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const section = queryParams.get("name");
  console.log(section);

  const renderComponent = () => {
    switch (section) {
      case "trending":
        return <Trending />;
      case "top":
        return <TopProducts />;
      case "genders":
        return <Genders />;
      case "rate":
        return <Goldprice />;
      case "categories":
        return <Categories />;
      case "Banner":
        return <Banner />;
      case "companies":
        return <Logos />;
      default:
        return (
          <p className="text-center mt-5">Please select a valid section.</p>
        );
    }
  };

  return <div className="w-100 mt-5 pt-5 ">{renderComponent()}</div>;
}

export default SectionPage;
