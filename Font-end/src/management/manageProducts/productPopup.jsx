import React, { useState } from 'react';
import { RiEditLine } from "react-icons/ri";
import { MdOutlineDeleteForever } from "react-icons/md";
import { SERVER_URL } from "../../config/HTTP.config";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../management.css"


function ProductPopup({ product, onClose }) {

  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();

  // Function to toggle full description
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const toedit = (productId) => {
    console.log(productId)
    navigate('/editProduct' , {state:{productId}})
}

  const shouldShowDescriptionButton = product.product_description.length > 100; // Adjust the threshold as needed

  const onDelete = async (productId) => {
    const confirmationResult = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    });

    if (confirmationResult.isConfirmed) {
        try {
            const response = await fetch( SERVER_URL + `product/delete/${productId}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                  }
                });

            if (response.ok) {
                setProducts(products.filter(product => product.product_id !== productId));
                Swal.fire({
                    title: "Deleted!",
                    text: "Your product has been deleted.",
                    icon: "success"
                });
            } else {
                // Handle error response
                console.error("Failed to delete product.");
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete product.",
                    icon: "error"
                });
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            Swal.fire({
                title: "Error!",
                text: "An error occurred while deleting product.",
                icon: "error"
            });
        }
    }
};

  return (
    <div className="popup">
      <div className="popup-inner">
        <div className='centered-content'>
          <img src={`http://localhost:8080/images/${product.img_url}`}
            alt={product.product_name}
            width={300} height={300} />
          <h5>{product.product_name}</h5>
        </div>
        <p>Size: {product.size_name}</p>
        <p>Brand: {product.brand_name}</p>
        <p>Stock: {product.product_stock}</p>
        <p>Price: {product.product_price} Baht</p>
        <div>
          {showFullDescription || !shouldShowDescriptionButton ? (
            <p>Product Description: {product.product_description}</p>
          ) : (
            <p>Product Description: {product.product_description.substring(0, 100)}...</p>
          )}{shouldShowDescriptionButton && (
            <button onClick={toggleDescription} className='readmore'>
              {showFullDescription ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
        <div className='buttoncommandpop'>
          <button onClick={onClose} className='viewDetails'>Close</button>
          <div className="btnDlEd">
            <RiEditLine size={40} onClick={() =>toedit(product.product_id)}/>
            <MdOutlineDeleteForever size={42} onClick={() => onDelete(product.product_id)}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPopup;