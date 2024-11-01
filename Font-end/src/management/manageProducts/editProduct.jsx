import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useParams } from 'react-router-dom';
import { SERVER_URL } from '../../config/HTTP.config';
import { Form, Button, FormGroup } from 'react-bootstrap';
import { useLocation , useNavigate } from 'react-router-dom';

import { API_GET, API_POST } from "../../config/API";
import axios from 'axios';

import '../management.css'

const MySwal = withReactContent(Swal);

function EditProduct(props) {
    let params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { productId } = location.state


    const [productName, setProductName] = useState("");
    const [gender, setGender] = useState([]);
    const [genderId, setGenderId] = useState(0);
    const [category, setCategory] = useState([]);
    const [categoryId, setCategoryId] = useState(0);
    const [subCategory, setSubCategory] = useState([]);
    const [subCategoryId, setSubCategoryId] = useState(0);
    const [sizeTypeId, setSizeTypeId] = useState(0);
    const [sizeType, setSizeType] = useState([]);
    const [sizeId, setSizeId] = useState(0);
    const [size, setSize] = useState([]);
    const [color, setColor] = useState([]);
    const [colorId, setColorId] = useState(0);
    const [brand, setBrand] = useState([]);
    const [brandId, setBrandId] = useState(0);
    const [productPrice, setProductPrice] = useState(0);
    const [productStock, setProductStock] = useState(0);
    const [productDescript, setProductDescript] = useState("");
    const [imgFile, setImgFile] = useState(null); // Store the selected image file

    const [loadingSubcategories, setLoadingSubcategories] = useState(false); // Add loading state
    const [loadingSize, setLoadingSize] = useState(false);
    const [validated, setValidated] = useState(false);
    const [product_id , setProductId] = useState([])
    const [gender_id , setgender] =useState([])

    //Fetch old data of product
    useEffect(() => {


        axios.get(`http://localhost:8080/api/products/${productId}`).then((data) => {
            const datas = data.data.data[0]
            // console.log(datas.product_id)

            setImgFile(datas.img_url)
            setProductId(datas.product_id);
            setProductName(datas.product_name);
            setgender(datas.gender_id);
            setCategoryId(datas.category_id);
            setSubCategoryId(datas.subCategory_id);
            setSizeId(datas.size_id);
            setColorId(datas.color_id);
            setBrandId(datas.brand_id);
            setProductPrice(datas.product_price);
            setProductStock(datas.product_stock);
            setProductDescript(datas.product_descript);
            console.log(datas.gender_id)
        }).catch((err) => {
            console.log(err)
        })

    }, [productId]);

    const updateproduct =()=>{
        const product_name = productName
        const category_id = categoryId
        const subCategory_id = subCategoryId
        const product_price = productPrice
        const product_stock = productStock
        const size_id = sizeId
        const color_id = colorId
        const product_description =productDescript
        const brand_id = brandId

        console.log(product_id ,product_name , gender_id , category_id ,subCategory_id , product_price , product_stock , size_id , color_id , product_description , brand_id)
        axios.put('http://localhost:8080/api/updateproduct' , {product_id , product_name ,gender_id, category_id ,subCategory_id,product_price,product_stock , size_id,color_id,product_description,brand_id}).then((res)=>{
            if(res){
                Swal.fire({
                    title:'update Success',
                    confirmButtonText:'OK'

                }).then((success)=>{
                    if(success.isConfirmed === true){
                        navigate('/manageProduct')
                    }
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    

    // Fetch gender data
    useEffect(() => {
        async function fetchGender() {
            try {
                const response = await fetch(SERVER_URL + "gender", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch gender data');
                }
                const json = await response.json();
                setGender(json.data);
            } catch (error) {
                console.error('Error fetching gender data:', error);
            }
        }
        fetchGender();
    }, []);

    console.log(gender)

    // Fetch category data
    useEffect(() => {
        async function fetchCategory() {
            try {
                const response = await fetch(SERVER_URL + "category", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch category data');
                }
                const json = await response.json();
                setCategory(json.data);
            } catch (error) {
                console.error('Error fetching category data:', error);
            }
        }
        fetchCategory();
    }, []);

    // Fetch subcategories based on selected category
    useEffect(() => {
        if (categoryId !== 0) {
            setLoadingSubcategories(true);
            async function fetchSubcategories() {
                try {
                    const response = await fetch(`${SERVER_URL}subcategory?categoryId=${categoryId}`, {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            Authorization: "Bearer " + localStorage.getItem("access_token")
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch subcategory data');
                    }
                    const json = await response.json();
                    setSubCategory(json.data);
                } catch (error) {
                    console.error('Error fetching subcategory data:', error);
                } finally {
                    setLoadingSubcategories(false);
                }
            }
            fetchSubcategories();
        } else {
            setSubCategory([]);
        }
    }, [categoryId]);

    // Fetch size types
    useEffect(() => {
        async function fetchSizeTypes() {
            try {
                const response = await fetch(SERVER_URL + "sizeType", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch size type data');
                }
                const json = await response.json();
                setSizeType(json.data);
            } catch (error) {
                console.error('Error fetching size type data:', error);
            }
        }
        fetchSizeTypes();
    }, []);

    // Fetch sizes based on selected size type
    useEffect(() => {
        if (sizeTypeId !== 0) {
            setLoadingSize(true);
            async function fetchSizes() {
                try {
                    const response = await fetch(`${SERVER_URL}size?sizeTypeId=${sizeTypeId}`, {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            Authorization: "Bearer " + localStorage.getItem("access_token")
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch size data');
                    }
                    const json = await response.json();
                    setSize(json.data);
                } catch (error) {
                    console.error('Error fetching size data:', error);
                } finally {
                    setLoadingSize(false);
                }
            }
            fetchSizes();
        } else {
            setSize([]);
        }
    }, [sizeTypeId]);

    // Fetch color data
    useEffect(() => {
        async function fetchColors() {
            try {
                const response = await fetch(SERVER_URL + "color", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch color data');
                }
                const json = await response.json();
                setColor(json.data);
            } catch (error) {
                console.error('Error fetching color data:', error);
            }
        }
        fetchColors();
    }, []);

    // Fetch brand data
    useEffect(() => {
        async function fetchBrands() {
            try {
                const response = await fetch(SERVER_URL + "brand", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch brand data');
                }
                const json = await response.json();
                setBrand(json.data);
            } catch (error) {
                console.error('Error fetching brand data:', error);
            }
        }
        fetchBrands();
    }, []);

    const doEditproduct = async () => { }

    function onValidated(event) {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            doEditproduct();
        }
        setValidated(true);
    }

    const handleImageChange = (e) => {
        setImgFile(e.target.files[0]); // Store the selected image file
    };

    return (
        <div className='bgmanage'>
            <div className='formSetting'>
                <div className='cardBodyForm'>
                    <div className='setForm'>
                        <div noValidate validated={onValidated} onSubmit={onValidated}>
                            <h4>Add product</h4>

                            <div className='uploadImg'>
                                <img src={`http://localhost:8080/images/${imgFile}`} width={120} alt="Product Preview" />
                                {/* <img src={imgFile ? URL.createObjectURL(imgFile) : ''} width={120} alt="Product Preview" /> */}
                            </div>
                            <div className='uploadImg'>
                                <input
                                    required
                                    type="file"
                                    name='file'
                                    accept="image/*"
                                    onChange={handleImageChange} />
                                <label type="invalid">
                                    Please select an image file.
                                </label>
                            </div>

                            <div className='spaceTop'>
                                <p>Product name</p>
                                <input
                                    required
                                    type="name"
                                    value={productName}
                                    placeholder="Enter product name"
                                    onChange={(e) => setProductName(e.target.value)} />
                                <label type="invalid">
                                    Please enter product name.
                                </label>
                            </div>
                            <div className='spaceTop'>
                                <label>Gender</label>
                                <select value={genderId} onChange={(e) => setGenderId(e.target.value)} required>
                                    <option value="">Select gender</option>
                                    {gender.map((item)=>{
                                        return(
                                            <option key={item.gender_id} value={item.gender_id}>{item.gender_name}</option>
                                        )
                                    })}
                                </select>
                                <Form.Control.Feedback type="invalid">Please select a gender.</Form.Control.Feedback>
                            </div>

                            <div controlId="category" className="inline-form-group">
                                <div className="inline-form-control">
                                    <label>Category</label>
                                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                                        <option value="">Select category</option>
                                        {category.map(item => (
                                            <option key={item.category_id} value={item.category_id}>{item.category_name}</option>
                                        ))}
                                    </select>
                                    <Form.Control.Feedback type="invalid">Please select a category.</Form.Control.Feedback>
                                </div>
                                <div className="inline-form-control">
                                    <label>Sub category</label>
                                    <select value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)} required>
                                        <option value="">Select sub category</option>
                                        {subCategory.map(item => (
                                            <option key={item.subcategory_id} value={item.subcategory_id}>{item.subcategory_name}</option>
                                        ))}
                                    </select>
                                    <Form.Control.Feedback type="invalid">Please select a sub category.</Form.Control.Feedback>
                                </div>
                            </div>


                            <div controlId="sizeType" className="inline-form-group">
                                <div className="inline-form-control">
                                    <label>Size type</label>
                                    <select value={sizeTypeId} onChange={(e) => setSizeTypeId(e.target.value)} required>
                                        <option value="">Select size type</option>
                                        {sizeType.map(item => (
                                            <option key={item.size_type_id} value={item.size_type_id}>{item.size_type_name}</option>
                                        ))}
                                    </select>
                                    <Form.Control.Feedback type="invalid">Please select a size type.</Form.Control.Feedback>
                                </div>
                                <div className="inline-form-control">
                                    <label>Size</label>
                                    <select value={sizeId} onChange={(e) => setSizeId(e.target.value)} required>
                                        <option value="">Select size</option>
                                        {size.map(item => (
                                            <option key={item.size_id} value={item.size_id}>{item.size_name}</option>
                                        ))}
                                    </select>
                                    <Form.Control.Feedback type="invalid">Please select a size.</Form.Control.Feedback>
                                </div>
                            </div>


                            <div className='spaceTop'>
                                <label>Color</label>
                                <select value={colorId} onChange={(e) => setColorId(e.target.value)} required>
                                    <option value="">Select color</option>
                                    {color.map(item => (
                                        <option key={item.color_id} value={item.color_id}>{item.color_name}</option>
                                    ))}
                                </select>
                                <Form.Control.Feedback type="invalid">Please select a color.</Form.Control.Feedback>
                            </div>


                            <div className='spaceTop'>
                                <label>Brand</label>
                                <select value={brandId} onChange={(e) => setBrandId(e.target.value)} required>
                                    <option value="">Select brand</option>
                                    {brand.map(item => (
                                        <option key={item.brand_id} value={item.brand_id}>{item.brand_name}</option>
                                    ))}
                                </select>
                                <Form.Control.Feedback type="invalid">Please select a brand.</Form.Control.Feedback>
                            </div>

                            <div className='spaceTop'>
                                <label>Product price</label>
                                <input
                                    required
                                    type="number"
                                    min={1}
                                    value={productPrice}
                                    placeholder="Enter product price"
                                    onChange={(e) => setProductPrice(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Please enter product price.
                                </Form.Control.Feedback>
                            </div>

                            <div className='spaceTop'>
                                <label>Product stock</label>
                                <input
                                    required
                                    type="number"
                                    min={1}
                                    value={productStock}
                                    placeholder="Enter product stock"
                                    onChange={(e) => setProductStock(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Please enter product stock.
                                </Form.Control.Feedback>
                            </div>

                            <div className='spaceTop'>
                                <label>Product description</label>
                                <input
                                    required
                                    as="textarea"
                                    rows={3} // Adjust rows as needed
                                    value={productDescript}
                                    placeholder="Enter product description"
                                    onChange={(e) => setProductDescript(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Please enter product description.
                                </Form.Control.Feedback>
                            </div>


                            <div className='btnAdd'>
                                <Button variant='primary' type="submit" onClick={updateproduct}>Add</Button>
                                <Button variant="danger" onClick={() => { window.location.href = '/manageProduct'; }}>Cancel</Button>
                            </div>
                        </div>
                    </div>

                    {loadingSubcategories && <div>Loading...</div>}
                    {loadingSize && <div>Loading...</div>}
                </div>
            </div>
        </div>
    );
}
export default EditProduct;