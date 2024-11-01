import React, { useState, useEffect } from 'react';
import '../../management.css';
import { SERVER_URL } from '../../../config/HTTP.config';
import { MdOutlineDeleteForever } from "react-icons/md";
import Swal from 'sweetalert2';

import BackToTopButton from '../../../component/backToTop';

function Report() {

  const [report, setReport] = useState([]);

  useEffect(() => {
    const getAllReport = async () => {
      try {
        const response = await fetch(SERVER_URL + "getReport", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access_token")
          },
        });

        const result = await response.json();
        if (result.result && result.data) {
          setReport(result.data); // Update the state with the correct data property
        } else {
          console.error("Failed to fetch report:", result.message);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    getAllReport();
  }, []);

  const onDelete = async (reportId) => {
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
        const response = await fetch(SERVER_URL + `report/delete/${reportId}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("access_token")
          }
        });

        if (response.ok) {
          setReport(report.filter(report => report.report_id !== reportId));
          Swal.fire({
            title: "Deleted!",
            text: "This report has been deleted.",
            icon: "success"
          });
        } else {
          // Handle error response
          console.error("Failed to delete this report.");
          Swal.fire({
            title: "Error!",
            text: "Failed to delete this report.",
            icon: "error"
          });
        }
      } catch (error) {
        console.error("Error deleting report:", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while deleting report.",
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
        {report.map((item) => (
          <div className='productCard' key={item.report_id}>
            <h5>Report id : {item.report_id}</h5>
            <p>Email : {item.email}</p>
            <p>Name : {item.name} {item.lastname}</p>
            <p>Report detail : {item.report}</p>
            <div className="btnmanage">
              <MdOutlineDeleteForever
                size={32}
                className="btnDlEd"
                onClick={() => onDelete(item.report_id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Report