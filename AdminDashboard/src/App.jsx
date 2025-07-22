import React from "react";
import { Routes, Route } from "react-router-dom";
import "./css/style.css";

import "./charts/ChartjsConfig";

// Import layout
import AdminLayout from "./partials/Mainlayout";

// Import pages
import Dashboard from "./pages/Dashboard";
import CategoryForm from "./partials/Categoryform";
import BannerForm from "./partials/Bannerform";
import GoldPriceForm from "./partials/GoldPriceForm";
import AdSectionForm from "./partials/AdSectionForm";
import Goldadform from "./partials/Goldadform";
import TopProductsform from "./partials/TopProductsform";
import GendersSectionForm from "./partials/GendersForm";
import Trending from "./partials/TrendingForm";
import AddProduct from "./partials/ProductAddDorm";
import MasterCategoryForm from "./partials/MasterCategoriesForm";
import CategoryEdit from "./partials/CategoryEdit";
import EditMasterCategory from "./partials/EditMasterCategory";
import EditProduct from "./partials/EditProduct";
import GetOrders from "./partials/GetOrders";

function App() {
  return (
    <Routes>
      {/* Wrap layout here */}
      <Route path="/" element={<AdminLayout />}>
        {/* Child routes will load inside AdminLayout's <Outlet /> */}
        <Route index element={<Dashboard />} />
        <Route path="Categoryform" element={<CategoryForm />} />
        <Route path="getorders" element={<GetOrders />} />
        <Route path="Bannerform" element={<BannerForm />} />
        <Route path="goldprice" element={<GoldPriceForm />} />
        <Route path="adsections" element={<AdSectionForm />} />
        <Route path="mastercategoryy" element={<MasterCategoryForm />} />
        <Route path="editcategory" element={<CategoryEdit />} />
        <Route path="editproduct" element={<EditProduct />} />
        <Route path="editmastercategory" element={<EditMasterCategory />} />
        <Route path="goldad" element={<Goldadform />} />
        <Route path="topproducts" element={<TopProductsform />} />
        <Route path="genders" element={<GendersSectionForm />} />
        <Route path="trending" element={<Trending />} />
        <Route path="product" element={<AddProduct />} />
      </Route>
    </Routes>
  );
}

export default App;
