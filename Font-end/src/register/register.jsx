import React, { useState } from 'react';
import { Form, FormGroup, Button } from 'react-bootstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom'; 
import './register.css';
import logowhite from '../login/logowhite.png'

export default function Register() {

    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validated, setValidated] = useState(false);

    //for set save button to save form data
    function onRegister(event) {
        const form = event.currentTarget;
        event.preventDefault();
    
        if (password !== confirmPassword) {
            MySwal.fire('Error', 'Passwords do not match!', 'error');
            return;
        }
    
        if (form.checkValidity() === false) {
        event.stopPropagation();
        } else {
             doAddCustomer();
        }
        setValidated(true);
    }    

    const doAddCustomer = async () => {

            try {
                const response = await fetch(
                    'http://localhost:8080/api/addCustomer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        phoneNum: phoneNum,
                        password: password
                    })
                });

                const data = await response.json();
                console.log(data);

                if (data.result) {

                    MySwal.fire({
                        title: <strong>Success!</strong>,
                        html: <i>Register successfully!</i>,
                        icon: 'success',
                        timer: 1000
                    }).then(() => {
                        navigate('/');
                    })
                } else {
                    MySwal.fire('Registration Failed', data.message, 'error');
                }

            } catch (error) {
                console.error('Error during the registration:', error);
                MySwal.fire('Error', 'Something went wrong during registration. Please try again later.', 'error');
            }
        }
    

    return (
        <div className='improve'>
            <div className='registerForm'>
            <img src={logowhite} width={300} height={90} style={{marginLeft: '6rem', marginRight: 'auto'}}></img>
                <Form noValidate validated={validated} onSubmit={onRegister} className='cardBodyRegis'>
                    <h4>Register</h4>
                            <FormGroup controlId='username'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control 
                                required
                                    type="username" 
                                    value={username} 
                                    placeholder="Enter username" 
                                    onChange={(e) => setUsername(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Please enter your username.
                                </Form.Control.Feedback>
                            </FormGroup>
                        <div className='grid-container'>
                            <FormGroup controlId='firstname'>
                                <Form.Label>Firstname</Form.Label>
                                <Form.Control 
                                required   
                                    type="firstname" 
                                    value={firstname} 
                                    placeholder="Enter firstname" 
                                    onChange={(e) => setFirstname(e.target.value)}
                                    />
                                <Form.Control.Feedback type="invalid">
                                    Please enter your firstname.
                                </Form.Control.Feedback>
                            </FormGroup>

                            <FormGroup controlId='lastname'>
                                <Form.Label>Lastname</Form.Label>
                                <Form.Control 
                                required   
                                    type="lastname" 
                                    value={lastname} 
                                    placeholder="Enter lastname" 
                                    onChange={(e) => setLastname(e.target.value)}
                                    />
                                <Form.Control.Feedback type="invalid">
                                    Please enter your lastname.
                                </Form.Control.Feedback>
                            </FormGroup>
                        </div>

                            <FormGroup controlId='email'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                required   
                                    type="email" 
                                    value={email} 
                                    placeholder="Enter email"
                                    onChange={(e) => setEmail(e.target.value)} 
                                    />
                                <Form.Control.Feedback type="invalid">
                                    Please enter your email.
                                </Form.Control.Feedback>
                            </FormGroup>

                            <FormGroup controlId='phoneNum'>
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control 
                                required   
                                    type="phonenumber" 
                                    value={phoneNum} 
                                    placeholder="Enter phone number"
                                    onChange={(e) => setPhoneNum(e.target.value)} 
                                    />
                                <Form.Control.Feedback type="invalid">
                                    Please enter your phone number.
                                </Form.Control.Feedback>
                            </FormGroup>

                        <div className='grid-container'>
                            <FormGroup controlId='password'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                required   
                                    type="password" 
                                    value={password} 
                                    placeholder="Enter password" 
                                    onChange={(e) => setPassword(e.target.value)}
                                    />
                                <Form.Control.Feedback type="invalid">
                                    Please enter your password.
                                </Form.Control.Feedback>
                            </FormGroup>

                            <FormGroup controlId='confirmPassword'>
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control 
                                required   
                                    type="password" 
                                    value={confirmPassword} 
                                    placeholder="Confirm password" 
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                <Form.Control.Feedback type="invalid">
                                    Please confirm your password.
                                </Form.Control.Feedback>
                            </FormGroup>
                        </div>
                        <div>
                            <Button type='submit' className='registerbtn '>Register</Button>
                            <p style={{textAlign: 'center'}}>already have account?</p>
                            <Button type='button' className='registerbtn '
                             href='/'
                             >Back to login</Button>
                            
                        </div>
                    
                    </Form>
                </div>
        </div>
    );
}
