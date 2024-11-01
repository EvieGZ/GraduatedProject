import { React, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import './cart.css'
import qrcode from './qrcode.png'

function Cart() {

    const location = useLocation();
    const navigate = useNavigate();

    const [transpotsdata, settranspots] = useState([])

    const [fname, setfname] = useState([])
    const [lname, setlname] = useState([])
    const [address, setaddress] = useState([])
    const [city, setcity] = useState([])
    const [street, setstreet] = useState([])
    const [zipcode, setzipcode] = useState([])
    const [tel, settel] = useState([])
    const [selecttran, setselectran] = useState({})
    const [transport_id, settransport_ids] = useState([])
    const [transport_price, settransport_prices] = useState(0)
    

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        const [id, price] = selectedValue.split(','); // แยกค่า id และ price ออกจากกัน
        settransport_ids(id);
        settransport_prices(price);
        // ทำอย่างอื่นตามต้องการ เช่น ส่ง id และ price ไปยังฟังก์ชัน setvaluetran
    };

    console.log(transport_id)
    console.log(transport_price)


    const { order_item_id, user_id, subtotal } = location.state
    console.log(order_item_id, user_id, subtotal, address, city, street, zipcode, tel)
    const transportprice = transport_price
    const transportprices = parseFloat(transportprice)
    const totalamout = subtotal + transportprices

    console.log(totalamout)

    const postorder = () => {
        const total_amount = totalamout
        // console.log(order_item_id, user_id, total_amount,transport_id , address, city, street, zipcode, tel )
        axios.post('http://localhost:8080/api/postorder', { order_item_id, user_id, total_amount, transport_id, address, city, street, zipcode, tel }).then((res) => {
            console.log(res.data)
            if (res) {
    
                Swal.fire({
                    title: 'Success',
                    icon: 'success',
                    confirmButtonText: 'ok'
                }).then((res) => {
                    if (res.isConfirmed) {
                        navigate('/customer')
                    }
                })
            }
            //   navigate('/customer')
        }).catch((err) => {
            console.log(err)
        })
    }

    const getorder = () => {
        axios.get('http://localhost:8080/api/getorders').then((res) => {
            console.log(res.data)
            //   navigate('/customer')
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        axios.get('http://localhost:8080/api/gertranspots').then((result) => {
            settranspots(result.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])


    return (
        <div className='containers'>
            <div className="box-item">
                <div style={{ display: 'flex' }} className="itemcontainer">
                    <div className="left">
                        <div className="name-qr">
                            <p>BILLING ADDRESS</p>
                        </div>
                        <div className="line"></div>
                        <div>
                            <p>QR Code Payment</p>
                        </div>
                        <div className="img-qr">
                            <img src={qrcode} alt="" />
                        </div>
                        <div className='content-about'>
                            <p>ยอดที่ต้องชำระ {subtotal} บาท</p>
                            <p>ค่าจัดส่ง {transportprice} บาท</p>
                            <p>รวมยอดที่ต้องชำระทั้งสิ้น {totalamout} บาท</p>
                        </div>
                    </div>

                    <div className="input-form">
                        <div className='item-input'>
                            <h4>Your Address</h4>
                            <div className='content-input'>
                                <div>
                                    <label htmlFor="firstname">Firstname:</label>
                                </div>
                                <input id='firstname' type="text" onChange={(e) => setfname(e.target.value)} />
                            </div>
                            <div className='content-input'>
                                <div>
                                    <label htmlFor="lastname">Lastname:</label>
                                </div>
                                <input id='lastname' type="text" onChange={(e) => setlname(e.target.value)} />
                            </div>
                            <div className='content-input'>
                                <div>
                                    <label htmlFor="address">Address:</label>
                                </div>
                                <input id='address' type="text" onChange={(e) => setaddress(e.target.value)} />
                            </div>
                            <div className='content-input'>
                                <div>
                                    <label htmlFor="city">City:</label>
                                </div>
                                <input id='city' type="text" onChange={(e) => setcity(e.target.value)} />
                            </div>
                            <div className='content-input'>
                                <div>
                                    <label htmlFor="street">Street:</label>
                                </div>
                                <input id='street' type="text" onChange={(e) => setstreet(e.target.value)} />
                            </div>
                            <div className='content-input'>
                                <div>
                                    <label htmlFor="zipcode">Zip Code:</label>
                                </div>
                                <input id='zipcode' type="number" onChange={(e) => setzipcode(e.target.value)} />
                            </div>
                            <div className='content-input'>
                                <div>
                                    <label htmlFor="tel">Tel:</label>
                                </div>
                                <input id='number' type="text" onChange={(e) => settel(e.target.value)} />
                            </div><br />
                            <select name="" id="" onChange={(e) => handleSelectChange(e)}>
                                <option value="">กรุณาเลือกวิธีการจัดส่ง</option>
                                {transpotsdata.map((transport) => {
                                    const transports = transport.transport_name
                                    const transports_id = transport.transport_id
                                    const transport_price = transport.transport_price
                                    return (
                                        <option key={transport.transport_id} value={`${transports_id},${transport_price}`}>
                                            {transport.transport_name} - {transport.transport_price} THB
                                        </option>
                                    )
                                })}
                            </select>
                            <div className='butt'>
                                <button onClick={postorder} >Check Out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart;
