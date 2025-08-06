import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "../admin/mainLayout";
import "../styles/newstyles.scss";
import "../styles/styles.scss";
import Users from "./Users";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import View from "./View";
import Login from "./Login";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Shop from "./Shop";
import Signup from "./Signup";
import Products from "../admin/Products";
import Orders from "../admin/Orders";
import Dashboard from "../admin/Dashbord";
import Userss from "../admin/Userss";
import SectionPage from "../components/SectionPage";
import CategoryProducts from "../ecommerce/CategoryDetail";
import ProductDetail from "../ecommerce/ProductDetail";
import CategoryPopoverContent from "../components/CategoryPopoverContent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartPage from "../ecommerce/CartPage";
import CheckoutPage from "../ecommerce/CheckoutPage";
import ThankYouPage from "../ecommerce/Success";
import Whishlist from "../ecommerce/Whishlist";
import MyOrders from "../ecommerce/MyOrders";
import About from "../ecommerce/About";
// import MapComponent from "../ecommerce/MapComponent";

function App() {
  const { user } = useSelector((state) => state.auth);
  const haiii = useSelector((state) => state.auth);
  // console.log("useruseruseruser", user);
  // console.log("haiiiii", haiii);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/myorders" element={<MyOrders />}></Route>
        <Route path="/cartpage" element={<CartPage />}></Route>
        <Route path="/checkout" element={<CheckoutPage />}></Route>
        <Route path="/success" element={<ThankYouPage />}></Route>
        <Route path="/wishlist" element={<Whishlist />}></Route>
        {/* <Route path="/map" element={<MapComponent />}></Route> */}
        <Route
          path="/popoovercategory"
          element={<CategoryPopoverContent />}
        ></Route>
        <Route path="/" element={<Shop />} />
        <Route path="/section" element={<SectionPage />} />
        <Route
          path="/categorydetail/:categoryId"
          element={<CategoryProducts />}
        />
        <Route path="/about" element={<About />}></Route>
        <Route path="/productdetail/:id" element={<ProductDetail />} />
        <Route path="/signup" element={<Signup />} />
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

        <Route
          path="/auth/*"
          element={
            <ProtectedRoute>
              <Outlet />
              <Routes>
                <Route path="/homee" element={<Users />} />
                <Route path="/create" element={<CreateUser />} />
                <Route path="/update/:id" element={<UpdateUser />} />

                <Route path="/view/:id" element={<View />} />
                <Route path="/admin/home" element={<AdminDashboard />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
