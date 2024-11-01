import React from 'react';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom'; // Import Navigate component
import './management.css'
import withReactContent from 'sweetalert2-react-content'
import { MdAddBox } from "react-icons/md";
import { MdReport } from "react-icons/md";
import { IoReceiptSharp } from "react-icons/io5";

const MySwal = withReactContent(Swal);

export default function MainManagement() {

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

  if (localStorage.getItem("access_token")) {
    return (
      <div className='bgmanage'>
        <div className='managebutton'>
          <div className='spaceTop'><button className='btnMage' onClick={() => { window.location.href = '/addProduct'; }}><h3>Add Products<MdAddBox className='symbol' size={30}/></h3></button></div>
          <div className='spaceTop'><button className='btnMage' onClick={() => { window.location.href = '/manageProduct'; }}><h3>Veiw and Manage Products</h3></button></div>
          <div className='spaceTop'><button className='btnMage' onClick={() => { window.location.href = '/orderProve'; }}><h3>Veiw orders<IoReceiptSharp  className='symbol' size={30}/></h3></button></div>
          <div className='spaceTop'><button className='btnMage' onClick={() => { window.location.href = '/report'; }}><h3>Veiw reports<MdReport  className='symbol' size={35}/></h3></button></div>

          <div className='spaceTop'><button className='logout'onClick={handleLogout}>Log out</button></div>
        </div>
      </div>
    )
}  else {

  MySwal.fire({
      icon: 'error',
      title: 'Cannot access',
      text: 'You do not have access to this content.',
  })
  
  return <Navigate to="/" replace />;
  }
}