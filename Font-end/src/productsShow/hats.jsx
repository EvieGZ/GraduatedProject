import { React, useEffect, useState } from "react";
import Navbar from "../component/navbar";
import ProductPopup from "./productPopup";
import { FaBagShopping } from "react-icons/fa6";
import { TiHeartFullOutline } from "react-icons/ti";
import "./productsShow.css";
import axios from 'axios';
import BackToTopButton from "../component/backToTop";

function Hat({ product_id, user_id }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const userId = localStorage.getItem("user_id");

  // Function to open the popup for a specific product
  const openPopup = (product) => {
    setSelectedProduct(product);
  };

  // Function to close the popup
  const closePopup = () => {
    setSelectedProduct(null);
  };

  useEffect(() => {
    const getAllProduct = async () => {
      const response = await fetch("http://localhost:8080/api/HatProduct", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setProducts(result.data);
    };

    getAllProduct();
  }, []);

  const addToBag = async (product_id) => {
    try {
        const response = await axios.post('http://localhost:8080/addToBag', {
            product_id,
            user_id: userId,  // This should be the ID of the currently logged-in user.
            quantity: 1  
        });

        if (response.data.message) {
          alert(response.data.message);
      }
      } catch (error) {
      alert(`Error: ${error.response ? error.response.data.message : error.message}`);
  }
};

  return (
    <div>
      <Navbar />
      <BackToTopButton />
      <div className="product-container">
        {products.map((item) => (
          <div key={item.product_id} className="productCard">
            <img
              src={`http://localhost:8080/images/${item.img_url}`}
              width={150}
              height={150}
            />
            <h5>{item.product_name}</h5>
            <p>Size: {item.size_name}</p>
            <p>Brand: {item.brand_name}</p>
            <p>{item.product_price} Baht</p>
            <div className="buttoncommand">
                <FaBagShopping size={25} style={{ marginLeft: "5px" }} onClick={() => addToBag(item.product_id)} />
              <button onClick={() => openPopup(item)} className="viewDetails">
                View Details
              </button>
              <TiHeartFullOutline size={27} style={{ marginLeft: "40px" }}/>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <ProductPopup product={selectedProduct} onClose={closePopup} />
      )}
    </div>
  );
}
export default Hat;