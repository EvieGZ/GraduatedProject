import React, { useEffect, useState } from 'react';
import './shoppingBagSidebar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';

export default function ShoppingBagSidebar({ isOpen, onClose, userId, onUpdate }) {

  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const MySwal = withReactContent(Swal);

  const fetchItems = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/bag/${userId}`);
      const data = await response.json();
      //console.log("Fetched items for user:", data);
      if (data.results) {
        setItems(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch items.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!userId) return;

    // Call fetchItems immediately
    fetchItems();
    // Set up a timer to call fetchItems every 1 seconds (or your desired interval)
    const interval = setInterval(fetchItems, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [userId]);

  //console.log("Is sidebar open?", isOpen);

  //function remove item
  const removeFromBag = async (product_id) => {
    try {
      const response = await axios.post('http://localhost:8080/api/removeFromBag', {
        product_id,
        user_id: userId
      });

      if (response.data.message === 'Successfully removed from bag!') {
        alert(response.data.message);

        // Refresh the items in the shopping bag sidebar after removal.
        await fetchItems();

        // Update the count in the Navbar
        if (onUpdate) {
          onUpdate(); // Calls the updateItemCount of Navbar
        }
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      alert(`Error: ${error.response ? error.response.data.message : error.message}`);
    }
  };


  useEffect(() => {
    const fetchBagItems = async () => {
      const response = await fetch(`http://localhost:8080/api/bag/${userId}`);
      const data = await response.json();
    };

    fetchBagItems();
  }, []);

  const opencard = async (order_item_id , user_id , subtotal) => {
    navigate('/cart' , {state:{order_item_id , user_id , subtotal}})

  }

  console.log(items)

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={onClose} className='closeBtn'>Close</button>
      <h4>Your Shopping Bag</h4>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {items.map(item => (
          <li key={item.order_item_id}>
            <button onClick={() => removeFromBag(item.product_id)} className="removeFromBagButton">x</button>
            <img
              src={`http://localhost:8080/images/${item.img_url}`}
              width={100}
              height={100}
            />
            <h6>{item.product_name}</h6>
            {item.quantity} items
            <br />
            {item.subtotal} Baht <br />
            <button onClick={() => opencard(item.order_item_id , item.user_id , item.subtotal )} className='payment'>
              Payment
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
}

