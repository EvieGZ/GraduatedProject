import { React, useState, useEffect } from 'react';
import { MdOutlineDeleteForever } from "react-icons/md";
import { SERVER_URL } from '../../../config/HTTP.config';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../../management.css"

function OrderPopup({ order, onClose }) {
    const [newOrderStatus, setNewOrderStatus] = useState(order.order_status_id);
    const [orderStatusId, setOrderStatusId] = useState(0);
    const [orderStatus, setOrderStatus] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        async function fetchOrderStatus() {
            try {
                const response = await fetch(SERVER_URL + "orderStatus", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch order status data');
                }
                const json = await response.json();
                setOrderStatus(json.data);
            } catch (error) {
                console.error('Error fetching order status data:', error);
            }
        }
        fetchOrderStatus();
    }, [order]);

    // Add console log to check if orderStatusId is updated when order changes
    useEffect(() => {
        console.log("orderStatusId updated:", orderStatusId);
    }, [orderStatusId]);

    const handleOrderStatusChange = async (e) => {
        const newStatusId = e.target.value;
        try {
            const response = await fetch(SERVER_URL + 'updateOrderStatus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                body: JSON.stringify({
                    order_id: order.order_id,
                    order_status_id: newStatusId
                })
            });


            if (response.ok) {
                setOrderStatusId(newStatusId);
                // If the request is successful, show a success message
                Swal.fire({
                    title: 'Success!',
                    text: 'Order status updated successfully.',
                    icon: 'success'
                });
            } else {
                // Handle error response
                console.error('Failed to update order status.');
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update order status.',
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while updating order status.',
                icon: 'error'
            });
        }
    };

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
                    console.error("Failed to delete order.");
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete order.",
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
        <div className="popup">
            <div className="popup-inner">
                <div className='centered-content'>
                    <h4>Order id : {order.order_id}</h4>
                    <h5>Username : {order.username}</h5>
                    <img src={`http://localhost:8080/images/${order.img_url}`}
                        alt={order.product_name}
                        width={300} height={300} />
                    <h5>{order.product_name}</h5>
                </div>
                <p>Subcategory : {order.subcategory_name}</p>
                <p>Color : {order.color_name}</p>
                <p>Size : {order.size_name}</p>
                <p>Brand : {order.brand_name}</p>
                <p>Quantity : {order.quantity}</p>
                <p>Total price : {order.total_amount} Baht</p>
                <p>Name : {order.firstname} {order.lastname}</p>
                <p>Email : {order.email}</p>
                <p>Tel. : {order.tel}</p>
                <p>Address : {order.address}</p>
                <p>City : {order.city}</p>
                <p>Street : {order.street}</p>
                <p>Zipcode : {order.zipcode}</p>
                <p>Transport : {order.transport_name}</p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h5 style={{ marginRight: '10px' }}>Order status : </h5>
                    <select value={order.order_status_id} onChange={handleOrderStatusChange}>
                        {orderStatus.map(item => (
                            <option key={item.order_status_id} value={item.order_status_id}>{item.order_status_name}</option>
                        ))}
                    </select>
                </div>


                <div className='buttoncommandpop'>
                    <button onClick={onClose} className='viewDetails'>Close</button>
                    <div className="btnDlEd">
                        {order.order_status_id === 5 && (
                            <MdOutlineDeleteForever
                                size={32}
                                className="btnDlEd"
                                onClick={() => onDelete(order.order_id)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderPopup