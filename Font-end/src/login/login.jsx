import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

import { React ,useState } from 'react';
import { Form,FormGroup, Button } from 'react-bootstrap';

import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { SERVER_URL } from '../config/HTTP.config.js';

import logowhite from './logowhite.png'

//เข้ารหัส user
import md5 from 'md5';

export default function Login() {

  const MySwal = withReactContent(Swal);

  const [username, setUsername] = useState('');  //เก็บข้อมูล usernameที่ผู้ใช้ป้อน
  const [password, setPassword] = useState(''); //เก็บข้อมูล passwordที่ผู้ใช้ป้อน

  const [validated, setValidated] = useState(false); //ตรวจสอบข้อมูลว่าผู้ใช้กรอกครบหรือไม่
  const [showWrongCredentials, setShowWrongCredentials] = useState(false);


  window.onload = () => {
    setShowWrongCredentials(false);
};

const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
        doLogin();
        setShowWrongCredentials(false);
    }
    setValidated(true);
};

  //getAuthenToken
  const getAuthenToken = async () => {
    const reponse = await fetch(
      SERVER_URL + 'authen_request',
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: md5(username)
        })
      }
    );

    const data = await reponse.json();
    //console.log(data);
    return data;
  };

  const getAccessToken = async(authToken) => {

    var authenSignature = md5(password);
  
    const response = await fetch(
        SERVER_URL + "access_request", 
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                auth_signature: authenSignature,
                auth_token: authToken
            })
        }
    );
  
    const data = await response.json();
    return data;
  };
  


//login to site
  const doLogin = async () => {

    try {

      const data1 = await getAuthenToken();
      console.log("Authen Token Response:", data1);

      if(data1.result) {

          const authToken = data1.data.auth_token;

          const data2 = await getAccessToken(authToken);
          console.log("Access Token Response:", data2);

          if(data2.result) {

              localStorage.setItem("access_token", data2.data.access_token);
              localStorage.setItem("user_id", data2.data.account_info.user_id);
              localStorage.setItem("username", data2.data.account_info.username);
              localStorage.setItem("firstname", data2.data.account_info.firstname);
              localStorage.setItem("lastname", data2.data.account_info.lastname);
              localStorage.setItem("email", data2.data.account_info.email);
              localStorage.setItem("role_id", data2.data.account_info.role_id);
              localStorage.setItem("role_name", data2.data.account_info.role_name);
              
              var role_id = data2.data.account_info.role_id;
              // var rolename = data2.data.account_info.role_name;
              // console.log(role_id);

              if(role_id === 1) {
                  // console.log(data.data.account_info.role_id);
                  
                  setShowWrongCredentials(false);

                  MySwal.fire({
                      title: <strong>Success!</strong>,
                      html: <i>Logged in successfully!</i>,
                      icon: 'success',
                      timer: 1000
                  }).then(() => {
                      window.location.href = ('/admin');
                  })


              } else if(role_id === 3) {

                  setShowWrongCredentials(false);

                  MySwal.fire({
                      title: <strong>Success!</strong>,
                      html: <i>Logged in successfully!</i>,
                      icon: 'success',
                      timer: 1000
                  }).then(() => {
                      window.location.href = ('/customer');
                  })


                  // console.log(data.data.account_info.role_id);
              }

          } else {

              MySwal.fire({
                  title: <strong>Oh no!</strong>,
                  html: <i>{data2.message}</i>,
                  icon: 'error'
              })

              setShowWrongCredentials(true);
              
          }

      } else {

          MySwal.fire({
              title: <strong>Oh no!</strong>,
              html: <i>{data1.message}</i>,
              icon: 'error'
          })

          setShowWrongCredentials(true);

      }

  } catch (error) {
      console.error("An error occurred:", error);
  }
  };

    return (
            <div className='improve'>
                    <div className='loginForm'>

                        <img src={logowhite} width={300} height={90} className='logo'></img>

                        <div className='cardBody'>

                            <h4>Login</h4>

                            <Form noValidate validated={validated} onSubmit={handleSubmit}>

                            {showWrongCredentials && (
                                <Form.Label className="text-danger float-end">Username or password incorrect!</Form.Label>
                            )}

                                <FormGroup className='mb-2' controlId='username'>
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" value={ username } onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please enter username.
                                    </Form.Control.Feedback>
                                </FormGroup>

                                <FormGroup className='mb-3' controlId='password'>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" value={ password } onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please enter password.
                                    </Form.Control.Feedback>
                                </FormGroup>

                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Remember me" />
                                </Form.Group>
                                <div>
                                <Button 
                                    type='submit' 
                                    style={{ width: '100%' }} 
                                    className='loginbtn' 
                                    >Login</Button>
                                <p style={{textAlign: 'center'}}>Not be member yet?</p>
                                <Button type='button'
                                    style={{ width: '100%'}} 
                                    className='loginbtn'
                                    href='/register'
                                    >Register</Button>
                                </div>
                            </Form>

                </div>

            </div>

        </div>

    );
}
