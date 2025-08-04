import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/footer";
import { IoMdHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get(
        `${API_URL}/products/category/${categoryId}?page=${page}&limit=8&sort=${sortOrder}`
      )
      .then((res) => {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      });
    axios
      .get(`${API_URL}/category`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, [categoryId, page, sortOrder]);

  const user = useSelector((state) => state.auth.user);

  const addtoWhishlist = async (product) => {
    try {
      if (!user?._id) return alert("Please log in first.");

      const res = await axios.get(`${API_URL}/wishlist/${user._id}`);
      const alreadyInWishlist = res.data.some(
        (item) => item.productId._id === product._id
      );

      if (alreadyInWishlist) {
        toast.info("This item is already in your wishlist.");
        return;
      }

      await axios.post(`${API_URL}/wishlist`, {
        userId: user._id,
        productId: product._id,
        price: product.price,
        aed: product.aed,
      });

      toast.success("Successfully added to wishlist!");
    } catch (err) {
      console.error("Error in posting to wishlist", err);
      toast.error("Failed to add to wishlist");
    }
  };

  return (
    <div>
      <div style={{ height: "65px" }}>
        <Header />
      </div>

      <div
        className="container-fluid border shadow"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="row">
          {isMobile && (
            <div className="p-3">
              <button
                className="btn btn-outline-secondary border p-2 shadow"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle categories"
              >
                <i className="fas fa-bars"></i> Categories
              </button>
            </div>
          )}

          {/* Categories Sidebar */}
          <div
            className={`py-3 ${
              isMobile ? (sidebarOpen ? "d-block" : "d-none") : ""
            }`}
            style={{
              height: "100vh",
              overflowY: "auto",
              width: isMobile ? "100%" : "20%",
              padding: isMobile ? "10px" : "0px 10px 0px 80px",
              position: isMobile ? "fixed" : "relative",
              top: isMobile ? "65px" : "auto",
              left: isMobile ? "0" : "auto",
              zIndex: isMobile ? "1050" : "auto",
              backgroundColor: "#fff",
              boxShadow: isMobile ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {isMobile && (
              <div className="d-flex justify-content-between align-items-center mb-3 ">
                <h5 className="mb-0 ">Categories</h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSidebarOpen(false)}
                >
                  ×
                </button>
              </div>
            )}

            {categories.map((item) => {
              const isActive = item._id === categoryId;
              return (
                <Link
                  key={item._id}
                  to={`/categorydetail/${item._id}`}
                  className="text-decoration-none text-dark"
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <div
                    className={`mb-2 d-flex align-items-center ${
                      isActive ? "bg-info text-white rounded" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={
                        item.image.startsWith("http")
                          ? item.image
                          : `${API_URL}/${item.image}`
                      }
                      alt={item.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "1px solid #ddd",
                        flexShrink: 0,
                      }}
                    />
                    <div
                      className="ms-2"
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        width: "100%",
                      }}
                    >
                      {item.name}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {isMobile && sidebarOpen && (
            <div
              className="position-fixed w-100 h-100"
              style={{
                top: "65px",
                left: "0",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: "1040",
              }}
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          {/* Products Section */}
          <div className={isMobile ? "py-3" : "col-md-9 py-3"}>
            <div className="mb-3 d-flex justify-content-end">
              <select
                className="form-select w-auto"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="">Sort by Price</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>

            <div
              className="row justify-content-center"
              style={{
                height: "100vh",
                overflowY: "auto",
                padding: "0px 10px 0px 0px",
              }}
            >
              {Array.isArray(products) && products.length > 0 ? (
                products.map((p) => (
                  <div
                    key={p._id}
                    className={
                      isMobile
                        ? "col-6 col-sm-6 mb-4"
                        : "col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                    }
                  >
                    <div
                      className="card h-100 p-2 shadow-sm border"
                      style={{ backgroundColor: "#fff" }}
                    >
                      <div className="text-end">
                        <IoMdHeartEmpty
                          size={isMobile ? 20 : 25}
                          onClick={() => addtoWhishlist(p)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                      <Link
                        to={`/productdetail/${p._id}`}
                        className="text-decoration-none text-dark"
                      >
                        <img
                          src={
                            p.image.startsWith("http")
                              ? p.image
                              : `${API_URL}/${p.image}`
                          }
                          alt={p.name}
                          className="card-img-top"
                          style={{
                            height: isMobile ? "100px" : "200px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="card-body">
                          <h5
                            className="card-title mt-3"
                            style={
                              isMobile
                                ? {
                                    fontSize: "13px",
                                    lineHeight: "1.2",
                                    display: "-webkit-box",
                                    WebkitLineClamp: "2",
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }
                                : {}
                            }
                          >
                            {p.name}
                          </h5>
                          <p
                            className="fw-bold text-black mb-1"
                            style={isMobile ? { fontSize: "14px" } : {}}
                          >
                            ₹{p.price}
                          </p>
                          <p
                            className="fw-semibold text-danger mb-1"
                            style={isMobile ? { fontSize: "12px" } : {}}
                          >
                            {p.stocks}
                          </p>
                          <div
                            style={{ fontSize: isMobile ? "12px" : "14px" }}
                            className="text-danger"
                          >
                            {p.stock}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center mt-5">
                  <h4>No products found in this category.</h4>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage(page - 1)}
                    >
                      {isMobile ? "‹" : "Previous"}
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pg) => (
                      <li
                        key={pg}
                        className={`page-item ${pg === page ? "active" : ""} ${
                          isMobile && Math.abs(pg - page) > 2 ? "d-none" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage(pg)}
                        >
                          {pg}
                        </button>
                      </li>
                    )
                  )}
                  <li
                    className={`page-item ${
                      page === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(page + 1)}
                    >
                      {isMobile ? "›" : "Next"}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryProducts;
