import React,{useState} from 'react';
import { FaBagShopping } from "react-icons/fa6";
import { TiHeartFullOutline } from "react-icons/ti";
import './productsShow.css';
import axios from 'axios';

function ProductPopup({ product, onClose }) {

    const [showFullDescription, setShowFullDescription] = useState(false);
    const userId = localStorage.getItem("user_id");
   
     // Function to toggle full description
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const shouldShowDescriptionButton = product.product_description.length > 100; // Adjust the threshold as needed
    
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
      else if (product.product_stock < 1) {
        alert('This product is out of stock!');
        return;
    }
      } catch (error) {
      alert(`Error: ${error.response ? error.response.data.message : error.message}`);
  }
};
    
  return (
    <div className="popup">
      <div className="popup-inner">
        <div className='centered-content'>
            <img src={`http://localhost:8080/images/${product.img_url}`} 
            alt={product.product_name}
            width={200} height={200}/>
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
        <div  className='buttoncommandpop'>
          <button onClick={onClose} className='viewDetails'>Close</button>
          <FaBagShopping size={35} style={{ marginLeft: '240px' }} onClick={() => addToBag(product.product_id)}/>
          <TiHeartFullOutline size={35} style={{ marginLeft: '40px',marginTop:'3px'}}/>
        </div>
      </div>
    </div>
  );
}

export default ProductPopup;