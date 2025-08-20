import "bootstrap/dist/css/bootstrap.min.css";
import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "../admin/mainLayout";
import "../styles/newstyles.scss";
import "../styles/styles.scss";
import Login from "./Login";
import Signup from "./Signup";
import Shop from "./Shop";
import ProtectedRoute from "./ProtectedRoute";
import SectionPage from "../components/SectionPage";
import CategoryProducts from "../ecommerce/CategoryDetail";
import ProductDetail from "../ecommerce/ProductDetail";
import CategoryPopoverContent from "../components/CategoryPopoverContent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Lazy load non-critical pages
const CartPage = lazy(() => import("../ecommerce/CartPage"));
const CheckoutPage = lazy(() => import("../ecommerce/CheckoutPage"));
const ThankYouPage = lazy(() => import("../ecommerce/Success"));
const Whishlist = lazy(() => import("../ecommerce/Whishlist"));
const MyOrders = lazy(() => import("../ecommerce/MyOrders"));
const About = lazy(() => import("../ecommerce/About"));
const Return = lazy(() => import("../ecommerce/Return"));

// ✅ Lazy load admin pages
const Products = lazy(() => import("../admin/Products"));
const Orders = lazy(() => import("../admin/Orders"));
const Dashboard = lazy(() => import("../admin/Dashbord"));
const Userss = lazy(() => import("../admin/Userss"));

// ✅ Lazy load user management pages
const Users = lazy(() => import("./Users"));
const CreateUser = lazy(() => import("./CreateUser"));
const UpdateUser = lazy(() => import("./UpdateUser"));
const View = lazy(() => import("./View"));
const AdminDashboard = lazy(() => import("../AdminDashboard/AdminDashboard"));

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ✅ Wrap lazy components with Suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Shop />} />
          <Route path="/section" element={<SectionPage />} />
          <Route
            path="/categorydetail/:categoryId"
            element={<CategoryProducts />}
          />
          <Route path="/productdetail/:id" element={<ProductDetail />} />
          <Route
            path="/popoovercategory"
            element={<CategoryPopoverContent />}
          />

          {/* Lazy loaded user-facing pages */}
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/cartpage" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<ThankYouPage />} />
          <Route path="/wishlist" element={<Whishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/return" element={<Return />} />

          {/* Admin protected routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Userss />} />
          </Route>

          {/* Auth protected routes */}
          <Route
            path="/auth/*"
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="homee" element={<Users />} />
            <Route path="create" element={<CreateUser />} />
            <Route path="update/:id" element={<UpdateUser />} />
            <Route path="view/:id" element={<View />} />
            <Route path="admin/home" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
