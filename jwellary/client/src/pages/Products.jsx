import React, { useEffect, useState } from "react";
import MyNavbar from "../components/MyNavbar";

import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchproducts();
  }, []);

  const fetchproducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/allproducts");
      setProducts(response.data);
    } catch (error) {
      console.log("error fetchin products", error);
    }
  };

  return (
    <div className=" vh-100 fs-1">
      <MyNavbar />
      <div className="bg-dark vh-100">
        <h2>PRODUCTS</h2>
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">₹ {product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
