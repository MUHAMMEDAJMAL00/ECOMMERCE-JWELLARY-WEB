import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/footer";
import { IoMdHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router-dom"; // if needed
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const navigate = useNavigate(); // use this inside your component
  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/products/category/${categoryId}?page=${page}&limit=8&sort=${sortOrder}`
      )
      .then((res) => {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      });
    axios
      .get("http://localhost:3001/category") // make sure this endpoint is correct
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, [categoryId, page, sortOrder]);
  // console.log("this is ", categories);

  //-----------------------------------
  const user = useSelector((state) => state.auth.user);
  const addtoWhishlist = async (product) => {
    try {
      if (!user?._id) return alert("Please log in first.");

      // 1. Fetch existing wishlist for the user
      const res = await axios.get(`http://localhost:3001/wishlist/${user._id}`);

      const alreadyInWishlist = res.data.some(
        (item) => item.productId._id === product._id
      );

      if (alreadyInWishlist) {
        toast.info("This item is already in your wishlist.");
        return;
      }

      // 2. If not, add to wishlist
      await axios.post("http://localhost:3001/wishlist", {
        userId: user._id,
        productId: product._id,
        price: product.price,
        aed: product.aed, // if applicable
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
        className="container-fluid border shadow "
        style={{ backgroundColor: "#fff" }}
      >
        <div className="row">
          <div
            className="py-3 "
            style={{
              height: "100vh",
              overflowY: "auto",
              width: "20%",
              padding: "0px 10px 0px 80px",
            }}
          >
            {categories.map((item, index) => {
              const isActive = item._id === categoryId;
              return (
                <Link
                  key={item._id}
                  to={`/categorydetail/${item._id}`}
                  className="text-decoration-none text-dark"
                >
                  <div
                    className={`mb-2 d-flex align-items-center  ${
                      isActive ? "bg-info  text-white rounded " : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "1px solid #ddd",
                      }}
                    />
                    <div
                      className="ms-2 "
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

          {/* Products */}
          <div className="col-md-9 py-3">
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
                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                  >
                    <div
                      className="card h-100 p-2 shadow-sm border-0"
                      style={{ backgroundColor: "#fff" }}
                    >
                      <div className="text-end">
                        <IoMdHeartEmpty
                          size={25}
                          onClick={() => addtoWhishlist(p)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                      <Link
                        to={`/productdetail/${p._id}`}
                        className="text-decoration-none text-dark"
                      >
                        <img
                          src={`http://localhost:3001${p.image}`}
                          alt={p.name}
                          className="card-img-top"
                          style={{
                            height: "220px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="card-body ">
                          <h5 className="card-title mt-3">{p.name}</h5>

                          <p className="fw-bold text-black mb-1">₹{p.price}</p>
                          <p className="fw-semibold text-danger mb-1">
                            {p.stocks}
                          </p>
                          <div
                            style={{ fontSize: "14px" }}
                            className=" text-danger"
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
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pg) => (
                      <li
                        key={pg}
                        className={`page-item ${pg === page ? "active" : ""}`}
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
                      Next
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
