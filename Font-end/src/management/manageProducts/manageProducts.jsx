import { React, useEffect, useState } from "react";
import BackToTopButton from "../../component/backToTop";
import { useNavigate } from 'react-router-dom';

import ProductPopup from "./productPopup";
import { RiEditLine } from "react-icons/ri";
import { MdOutlineDeleteForever } from "react-icons/md";
import '../management.css'
import { SERVER_URL } from "../../config/HTTP.config";
import Swal from 'sweetalert2';


export default function manageProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const toedit = (productId) => {
        console.log(productId)
        navigate('/editProduct' , {state:{productId}})
    }



    if (localStorage.getItem("access_token")) {

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
                const response = await fetch("http://localhost:8080/api/allProduct", {
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
                    const response = await fetch(SERVER_URL + `product/delete/${productId}`, {
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
            <div>
                <BackToTopButton />
                <button className='BackToManage' onClick={() => { window.location.href = '/admin'; }}>
                    Back to management page
                </button>
                <div className='productShow'>
                    {products.map((item) => {
                        const productId = item.product_id
                        return (
                            <div className='productCard' key={item.product_id}>
                                <img
                                    src={`http://localhost:8080/images/${item.img_url}`}
                                    width={150}
                                    height={150}
                                />
                                <h5>{item.product_name}</h5>
                                <p>Size: {item.size_name}</p>
                                <p>Brand: {item.brand_name}</p>
                                <p>{item.product_price} Baht</p>
                                <div className="btnmanage">
                                    <RiEditLine size={30} className="btnDlEd" onClick={() =>toedit(productId)} />
                                    <button onClick={() => openPopup(item)} className="viewDetails">
                                        View Details
                                    </button>
                                    <MdOutlineDeleteForever size={32} className="btnDlEd" onClick={() => onDelete(item.product_id)} />
                                </div>
                            </div>
                        )
                    })}
                </div>
                {selectedProduct && (
                    <ProductPopup product={selectedProduct} onClose={closePopup} />
                )}
            </div>
        );
    } else {

        MySwal.fire({
            icon: 'error',
            title: 'Cannot access',
            text: 'You do not have access to this content.',
        })

        return <Navigate to="/" replace />;

    }
};