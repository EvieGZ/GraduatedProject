import React, { useState, useEffect, useRef } from 'react';
import './componentcss/navbar.css'
import logo from './logo.png'
import { Link } from 'react-router-dom';
import { FaBagShopping } from "react-icons/fa6";
import { TiHeartFullOutline } from "react-icons/ti";
import { BsPersonHearts } from "react-icons/bs";
import { RiCustomerServiceFill } from "react-icons/ri";
import DropdownProfile from './dropdown';
import PopupCusService from './popupCusService';
import ShoppingBagSidebar from '../productsShow/shoppingBagSidebar';
import Profile from './profile';

export default function Navbar() {
  //dropdown cus
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [itemCount, setItemCount] = useState(0);

  //shopping bag
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const userId = localStorage.getItem("user_id");
  //open bag side bar
  const handleOpenSidebar = () => {
    setSidebarOpen(true);
    //console.log("Sidebar should be open now:", isSidebarOpen); 
};

const handleOpenSide = () => {
  setSidebarOpen(true);
  //console.log("Sidebar should be open now:", isSidebarOpen); 
};

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  //count item in bag
  const fetchItemCount = () => {
    // Fetch the total number of items for the logged-in user
    fetch(`http://localhost:8080/api/bag/count/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.count) {
                setItemCount(data.count);
            }
        })
        .catch(error => {
            console.error("Error fetching item count:", error);
        });
};

const updateItemCount = () => {
  // Optimistically decrease the count by 1
  setItemCount(prevCount => prevCount - 1);

  // Fetch the latest count from the server
  fetch(`http://localhost:8080/api/bag/count/${userId}`)
      .then(response => response.json())
      .then(data => {
          if (data && data.count) {
              setItemCount(data.count);
          }
      })
      .catch(error => {
          console.error("Error fetching item count:", error);
      });
};


  useEffect(() => {
    if (!userId) return;

    // Fetch the count immediately when the effect runs
    fetchItemCount();

    // Set up polling to fetch the count 
    const intervalId = setInterval(fetchItemCount);  // 1000ms = 1 second

    // Clean up the interval when the component is unmounted or if userId changes
    return () => clearInterval(intervalId);
}, [userId]);


  //popup cus service
  const [isPopupOpen, setPopupOpen] = useState(false);

  // Function to toggle the dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Function to close the dropdown
  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  // Function to open the popup
  const openPopup = () => {
    setPopupOpen(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setPopupOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    };

    // Add a click event listener to the entire document
    document.addEventListener('click', handleClickOutside);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className='nav'>
        <Link to = '/customer'><img src={logo} width={151} height={46} className='title'/></Link>
        <div className='icon-container' >
          
          <FaBagShopping size={20} className='icon' onClick={handleOpenSidebar} />{itemCount}

          <RiCustomerServiceFill size={20} className='icon' onClick={openPopup}/>
          
          <div ref={dropdownRef}>
            <BsPersonHearts size={20} className='icon' onClick={toggleDropdown}/>
          </div>
          
          
        
        </div>
      </div>
      {isDropdownOpen && <DropdownProfile/>}
      {isPopupOpen && <PopupCusService onClose={closePopup}/>}
      {isSidebarOpen && <ShoppingBagSidebar 
                    isOpen={isSidebarOpen} 
                    onClose={handleCloseSidebar} 
                    userId={userId} 
                    onUpdate={updateItemCount}  
                    // Passing the callback
                />}
    </div>
  )
}


