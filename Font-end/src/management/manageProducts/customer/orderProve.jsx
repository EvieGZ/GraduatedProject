import React, { useState, useEffect } from 'react';
import '../../management.css';
import { SERVER_URL } from '../../../config/HTTP.config';
import OrderPopup from './orderPopup';
import { MdOutlineDeleteForever } from "react-icons/md";
import Swal from 'sweetalert2';

import BackToTopButton from '../../../component/backToTop';

function OrderProve() {

  const [order, setOrder] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (localStorage.getItem("access_token")) {

    // Function to open the popup for a specific order
    const openPopup = (order) => {
      setSelectedOrder(order);
    };

    // Function to close the popup
    const closePopup = () => {
      setSelectedOrder(null);
    };

    useEffect(() => {
      const getAllOrder = async () => {
        try {
          const response = await fetch(SERVER_URL + "getOrders", {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("access_token")
            },
          });

          const result = await response.json();
          if (result.result && result.data) {
            setOrder(result.data); // Update the state with the correct data property
          } else {
            console.error("Failed to fetch orders:", result.message);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      getAllOrder();
    }, []);

    const onDelete = async (orderId) => {
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
          const response = await fetch(SERVER_URL + `order/delete/${orderId}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("access_token")
            }
          });

          if (response.ok) {
            setOrder(order.filter(order => order.order_id !== orderId));
            Swal.fire({
              title: "Deleted!",
              text: "This order has been deleted.",
              icon: "success"
            });
          } else {
            // Handle error response
            console.error("Failed to delete this order.");
            Swal.fire({
              title: "Error!",
              text: "Failed to delete this order.",
              icon: "error"
            });
          }
        } catch (error) {
          console.error("Error deleting order:", error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting order.",
            icon: "error"
          });
        }
      }
    };

    return (
      <div>
        <BackToTopButton />
        <button className='BackToManage' onClick={() => { window.location.href = '/admin'; }}>
          Back to management page
        </button>
        <div className='productShow'>
          {order.map((item) => (
            <div className='productCard' key={item.order_id}>
              <h5>Order id : {item.order_id}</h5>
              <p>Username : {item.username}</p>
              <p>Order status : {item.order_status_name}</p>
              <div className="btnmanage">
                <button onClick={() => openPopup(item)} className="viewDetails">
                  View Details
                </button>
                {item.order_status_id === 5 && (
                  <MdOutlineDeleteForever
                    size={32}
                    className="btnDlEd"
                    onClick={() => onDelete(item.order_id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        {selectedOrder && (
                    <OrderPopup order={selectedOrder} onClose={closePopup} />
                )}
      </div>
    );
  } else {

    Swal.fire({
      icon: 'error',
      title: 'Cannot access',
      text: 'You do not have access to this content.',
    })

    return <Navigate to="/" replace />;

  }
}

export default OrderProve