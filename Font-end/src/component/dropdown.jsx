import React, { useState, useEffect, Profiler } from "react";
import './componentcss/dropdown.css'


const DropdownProfile = () =>  {
 

  const username = localStorage.getItem("username");
  console.log(localStorage)

  function handleLogout() {
    // Clear all relevant local storage items
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    localStorage.removeItem('email');
    localStorage.removeItem('role_id');
    localStorage.removeItem('role_name');
  
    // Redirect user to the login or home page
    window.location.href = "/";
  }
 
  return (
    <div className='dropdownProfile'>
        <ul className='textDropdown'>
          <h6>{username}</h6>
          {/* <li className="profile">My profile</li> */}
          <li className='setText' onClick={handleLogout}>Sign out</li>
        </ul>
    </div>
  )
}

export default DropdownProfile;
