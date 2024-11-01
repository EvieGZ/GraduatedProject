import {React,useState} from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './componentcss/profile.css'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom'; 
import { TiBell } from 'react-icons/ti';

function Profile() {
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [tel, setTel] = useState('');
  const [displayData, setDisplayData] = useState(false);
  
  const saveChanges = () => {
    console.log('Saved changes:', {firstName, lastName, gender, birthDate, tel });
    setDisplayData(true);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const handleBirthDateChange = (event) => {
    setBirthDate(event.target.value);
  };

  const handleTelChange = (event) => {
    setTel(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // ทำสิ่งที่คุณต้องการเมื่อยืนยันการแก้ไขโปรไฟล์
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Gender', gender);
    console.log('BirthDate', birthDate);
    console.log('Tel', tel);
  
  };

  return (
    <div className='containers'><br />
     <button className='BackToManage' onClick={() => { window.location.href = 'customer'; }}>
                    Back to Home page
                </button>
    <div className='container'><br />
      <h3>My Profile</h3><br />
      <form onSubmit={handleSubmit}>
        <div className='editprofile'>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
          />
        </div>
        <div className='editprofile'>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={handleLastNameChange}
          />
        </div>
        <div>
        <p>Gender:</p>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div><br />

        <div>
        <p>Birth Date:</p>
        <DatePicker
          selected={birthDate}
          onChange={(date) => setBirthDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>
        <div>
          <label htmlFor="tel">Tel:</label>
          <input
            type="text"
            id="tel"
            value={tel}
            onChange={handleTelChange}
          />
        </div><br />
        <div className='button'>
        <button onClick={saveChanges}>Save Changes</button>
        </div>
      </form>

    
    </div>
</div>
        );
}

export default Profile;

