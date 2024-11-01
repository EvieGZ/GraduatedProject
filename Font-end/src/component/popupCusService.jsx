import {React,useState} from 'react'
import { useParams } from 'react-router-dom';
import { Form, Button} from "react-bootstrap";
import './componentcss/popupCusService.css'

function PopupCusService({ onClose }) {
     // Function to close the popup
  const handleCloseClick = () => {
    onClose();
  };

  let params = useParams();

  const [emailReport, setEmailReport] = useState("");
  const [nameReport, setNameReport] = useState("");
  const [lastnameReport, setLastnameReport] = useState("");
  const [report, setReport] = useState("");
  const [validated, setValidated] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // State to track form submission

// Success message to display when the form is successfully submitted
  const successMessage = isFormSubmitted ? (
  <div className="successMessage">
    Your report successfully sent to us!
  </div>
) : null;


  //for set save button to save form data
  function onSave(event) {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      doAddReport();
    }
    setValidated(true);
  }

  // Function to reset the form fields
  function onReset(event) {
    event.preventDefault();

    // Reset all form fields to their initial values
    setEmailReport("");
    setNameReport("");
    setLastnameReport("");
    setReport("");

    // Reset form validation
    setValidated(false);
  }

  // Function to handle form submission
  async function doAddReport() {
    try {
      const response = await fetch("http://localhost:8080/api/customer_service/add", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailReport,
          name: nameReport,
          lastname: lastnameReport,
          report: report,
        }),
      });
  
      if (response.ok) {
        // Form data was successfully submitted
        setIsFormSubmitted(true); // Set the form submission state to true
        
        // Delay closing the popup for 2 seconds (adjust the time as needed)
        setTimeout(() => {
          onClose(); // Close the popup after the delay
        }, 2000); // 2000 milliseconds = 2 seconds
      } else {
        // Handle the case where the submission failed, e.g., show an error message
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
  

  return ( 
      <div className='popup'>
      <div className="popup-inner">
        <button className="close-btn" onClick={handleCloseClick}>X</button>
        <h3>Customer Service Report</h3>
        <Form noValidate validated={validated} onSubmit={onSave}>
          <Form.Group controlId="formBasicEmail" >
            <Form.Label>Email</Form.Label>
            <Form.Control className='inform'
              required
              type="email"
              placeholder="Enter your email.."
              value={emailReport}
              onChange={(e) => setEmailReport(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control className='inform'
              required
              type="text"
              placeholder="Enter your name.."
              value={nameReport}
              onChange={(e) => setNameReport(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your name.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicLastname">
            <Form.Label>Last Name</Form.Label>
            <Form.Control className='inform'
              required
              type="text"
              placeholder="Enter your lastname.."
              value={lastnameReport}
              onChange={(e) => setLastnameReport(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your last name.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicReport">
            <Form.Label>Report</Form.Label>
            <Form.Control className='inform'
              required
              as="textarea"
              rows={4}
              placeholder="Enter your report.."
              value={report}
              onChange={(e) => setReport(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your report.
            </Form.Control.Feedback>
          </Form.Group>
          <div className='button'>
          <Button variant="primary" type="submit" className='submitbtn'>
            Submit
          </Button>
          <Button variant="secondary" type="button" onClick={onReset}>
            Reset
          </Button>
          </div>
          {successMessage}
        </Form>
      </div>
    </div>
  )
}
export default PopupCusService