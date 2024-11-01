const express = require("express");
const app = express();
const port = 8080;
const multer = require("multer");
var jwt = require("jsonwebtoken");
const util = require("util");

const bodyParser = require('body-parser');

const cors = require("cors");

app.use(cors());
//parse application/x-www-form-urlencoded อ่านข้อมูลผู้ใช้ที่ป้อนผ่านฟอร์มบน web app
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json ทำให้ express สามารถอ่านข้อมูลในรูปแบบ JSON ที่ได้รับจาก request ของ web app
app.use(bodyParser.json());

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "comely",
    port: 3306
});

pool.query = util.promisify(pool.query);

//Library module import
const user = require('./libs/user');
const products = require('./libs/products');
const order = require('./libs/order')
const shoppingBag = require("./libs/shoppingBag");
const transports = require('./libs/transpots')

app.get('/', (req, res) => {
    res.send('Server is running!');
});

//for express , images can be used via http
app.use('/images', express.static('images'));

// authen request
app.post('/api/authen_request', (req, res) => {

    const sql = "SELECT * FROM user where md5(username) = ?";

    pool.query(sql, [req.body.username], (error, results) => {

        var response;

        if (error) {

            response = {
                result: false,
                message: error.message
            };

        } else {

            if (results.length) {

                var payload = { username: req.body.username };
                var secretKey = "LoginKey";
                const authToken = jwt.sign(payload, secretKey);
                response = {
                    result: true,
                    data: {
                        auth_token: authToken
                    }
                };

            } else {
                response = {
                    result: false,
                    message: "Username incorrect."
                };
            }

        }

        res.json(response);
    });

});

//get authen and send to access request
app.post('/api/access_request', (req, res) => {

    const authenSignature = req.body.auth_signature;
    const authToken = req.body.auth_token;

    var decoded = jwt.verify(authToken, "LoginKey");

    if (decoded) {
        const query = "SELECT * FROM user a " +
            "JOIN role b ON a.role_id = b.role_id " +
            "WHERE md5(username) = ? AND password = ?";
        pool.query(query, [decoded.username, authenSignature], (error, results) => {

            var response;

            if (error) {

                response = {
                    result: false,
                    message: error.message
                };

            } else {

                if (results.length) {

                    var payload = {
                        user_id: results[0].user_id,
                        username: results[0].username,
                        firstname: results[0].firstname,
                        lastname: results[0].lastname,
                        email: results[0].email,
                        phoneNum: results[0].phoneNum,
                        role_id: results[0].role_id,
                        role_name: results[0].role_name
                    };

                    const accessToken = jwt.sign(payload, "LoginKey");

                    response = {
                        result: true,
                        data: {
                            access_token: accessToken,
                            account_info: payload
                        }
                    };

                } else {
                    response = {
                        result: false,
                        message: "Username or Password incorrect."
                    };
                }
            }

            res.json(response);

        });
    }
})

//  middleware secure
let checkAuth = (req, res, next) => {

    let token = null;

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        token = req.query.token;
    } else {
        token = req.body.token;
    }

    if (token) {

        jwt.verify(token, "LoginKey", (err, docoded) => {

            if (err) {
                res.send(JSON.stringify({
                    result: false,
                    message: "You are not signed in. Please login first."
                }));
            } else {
                req.docoded = docoded;
                next();
            }

        });

    } else {
        res.status(401).send("Not authorized");
    }
}

app.get('/api/loggedinUser', checkAuth, (req, res) => {
    const userInfo = req.docoded;
    res.json(userInfo);
});

app.get('/logout', (req, res) => {
    req.session.destroy(); // If using express-session
    res.redirect('/login');
});

//for add customer
app.post('/api/addCustomer', async (req, res) => {
    const details = req.body;

    try {
        var result = await user.createCustomer(pool,
            details.username,
            details.firstname,
            details.lastname,
            details.email,
            details.phoneNum,
            details.password
        )
        res.json({
            result: true,
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});



//customr report
app.post("/api/customer_service/add", (req, res) => {
    const emailReport = req.body.email;
    const nameReport = req.body.name;
    const lastnameReport = req.body.lastname;
    const report = req.body.report;

    const sql = "INSERT INTO customerservice_report (email,name,lastname,report) VALUES (?, ?, ?, ?)";

    pool.query(sql, [emailReport, nameReport, lastnameReport, report], function (error, results, fields) {
        try {

            res.json({
                result: true,
            });

        } catch (ex) {
            res.json({
                result: false,
                message: ex.message
            });
        }
    });
});

//show select values
app.get("/api/gender", checkAuth, (req, res) => {
    const query = "SELECT * FROM gender";

    pool.query(query, (error, results) => {
        if (error) {
            res.json({
                result: false,
                message: error.message
            })
        } else {
            res.json({
                result: true,
                data: results
            });
        }
    });
});

app.get("/api/category", checkAuth, async (req, res) => {
    try {
        var results = await products.getCategory(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }
});

app.get("/api/subcategory", checkAuth, async (req, res) => {
    try {
        const categoryId = req.query.categoryId;
        var results = await products.getSubCategory(pool, categoryId); // Pass categoryId to the function

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.status(500).json({
            results: false,
            message: ex.message
        });
    }
});

app.get("/api/sizeType", checkAuth, async (req, res) => {
    try {
        var results = await products.getSizeType(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }
});

app.get("/api/size", checkAuth, async (req, res) => {
    try {
        const sizeTypeId = req.query.sizeTypeId;
        var results = await products.getSize(pool, sizeTypeId);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.status(500).json({
            results: false,
            message: ex.message
        });
    }
});

app.get("/api/color", checkAuth, async (req, res) => {
    try {
        var results = await products.getColor(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }
});

app.get("/api/brand", checkAuth, async (req, res) => {
    try {
        var results = await products.getBrand(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }
});

//add product
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images'); // Specify the directory where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Generate a unique filename
    }
});

// Create an upload instance with the specified storage configuration
const upload = multer({ storage: storage }) // 'file' corresponds to the name attribute in the form input for the file upload

// Endpoint for adding a product along with image upload
app.post("/api/addProduct", upload.single('img_name'), async(req, res) => {
    // ดำเนินการเพิ่มสินค้าที่นี่
    const product_name = req.body.product_name
    const gender_id = req.body.gender_id
    const category_id = req.body.category_id
    const subCategory_id = req.body.subCategory_id
    const product_price = req.body.product_price
    const product_stock = req.body.product_stock
    const size_id = req.body.size_id
    const color_id = req.body.color_id
    const product_descript = req.body.product_descript
    const brand_id = req.body.brand_id
    const img_url = req.body.img_name

    try{
        var result = await products.addProduct(pool,
            product_name,
            gender_id,
            category_id,
            subCategory_id,
            product_price,
            product_stock,
            img_url,
            size_id ,
            color_id,
            product_descript,
            brand_id 
            
            );
        res.json({
            result:true,
            message:result
        })
    }catch (ex){
        res.json({
            result:false,
            message:ex.message
        })
    }


});


//manage product
app.get("/api/products/:productId", async (req, res) => {
    const productId = req.params.productId;

    try {
        var result = await products.getByProductId(pool, productId);

        res.json({
            result: true,
            data: result
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.put("/api/updateproduct",async (req, res) => {
    const {product_id ,product_name , gender_id , category_id ,subCategory_id , product_price , product_stock , size_id , color_id , product_description , brand_id} = req.body;
    console.log(product_id ,product_name , gender_id , category_id ,subCategory_id , product_price , product_stock , size_id , color_id , product_description , brand_id)

    try {
        var result = await products.updateProduct(pool,
            product_id,
            product_name,
            gender_id,
            category_id,
            subCategory_id,
            product_price,
            product_stock,
            size_id,
            color_id,
            product_description,
            brand_id);

        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.delete("/api/product/delete/:productId", checkAuth, async (req, res) => {
    const productId = req.params.productId;

    try {
        var result = await products.deleteProduct(pool, productId);

        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

//products
app.get("/api/allProduct", async (req, res) => {

    try {
        var results = await products.getProductList(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }

});

app.get("/api/TopProduct", async (req, res) => {

    try {
        var results = await products.getTopCategory(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }

});

app.get("/api/FullBodyProduct", async (req, res) => {

    try {
        var results = await products.getFullBodyCategory(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }

});

app.get("/api/BottomProduct", async (req, res) => {

    try {
        var results = await products.getBottomCategory(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }

});

app.get("/api/AccessoryProduct", async (req, res) => {

    try {
        var results = await products.getAccessoryCategory(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }

});

app.get("/api/ShoeProduct", async (req, res) => {

    try {
        var results = await products.getShoeCategory(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }

});

app.get("/api/HatProduct", async (req, res) => {

    try {
        var results = await products.getHatCategory(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }

});

app.get("/api/SwimwearProduct", async (req, res) => {

    try {
        var results = await products.getSwimwearCategory(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }

});

//category
app.get("/api/category", async (req, res) => {

    try {
        var results = await products.getProductCategory(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }
});


//remove from bag
app.post('/api/removeFromBag', async (req, res) => {
    const { product_id, user_id } = req.body;

    try {
        const result = pool.query('DELETE FROM order_items WHERE user_id = ? AND product_id = ?', [user_id, product_id]);
        if (result.affectedRows === 0) {
            // No rows were deleted. Maybe the item wasn't in the bag?
            return res.status(404).send({ message: 'Item not found in the bag!' });
        }
        // Item successfully removed from the bag
        return res.status(200).send({ message: 'Item removed from the bag!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'An error occurred while removing the item from the bag.' });
    }
});

//get bag
app.get("/api/bag", async (req, res) => {
    // Retrieve userId from session (assuming you're using express-session)
    const userId = req.session.user_id;

    try {
        const results = await shoppingBag.getBagItem(pool, userId);

        return res.status(200).json({
            results: true,
            data: results
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            results: false,
            message: 'An error occurred while retrieving the shopping bag items.'
        });
    }
});

//get bag by user id
app.get('/api/bag/:userId', async (req, res) => {
    const userId = req.params.userId;

    // Validate the userId (This step is crucial if userIds are numeric)
    if (!userId || typeof userId !== "string") {
        return res.status(400).json({
            results: false,
            message: 'Invalid user ID.'
        });
    }

    try {
        const results = await shoppingBag.getBagItemByUserId(pool, userId);

        return res.status(200).json({
            results: true,
            data: results
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            results: false,
            message: 'An error occurred while retrieving the shopping bag items for the user.'
        });
    }
});



// Add to favorites
app.post('/api/addfavorites', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        await pool.query('INSERT INTO favorites (user_id, product_id) VALUES (?, ?)', [userId, productId]);
        res.status(200).json({ message: "Product added to favorites" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove from favorites
app.post('/api/deletefavorites', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        await pool.query('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [userId, productId]);
        res.status(200).json({ message: "Product removed from favorites" });
    } catch (error) {
        res.status(500).json({ message: "Error removing product from favorites" });
    }
});

// List all favorites for a user
app.get('/favorites/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        var results = await shoppingBag.getAllFav(pool, userId);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching favorites" });
    }
});


//customr report
app.post("/api/profile/add", (req, res) => {
    const firstnameReport = req.body.firstname;
    const lastnameReport = req.body.lastname;
    const genderReport = req.body.gender;
    const birthdateReport = req.body.birthdate;
    const telReport = req.body.tel;
    const report = req.body.report;

    const sql = "INSERT INTO profile (fiestname,lastname,gender,birthdate,tel,eport) VALUES (?, ?, ?, ?, ?, ?)";

    pool.query(sql, [firstnameReport, lastnameReport, genderReport, birthdateReport, telReport, report], function (error, results, fields) {
        try {

            res.json({
                result: true,
            });

        } catch (ex) {
            res.json({
                result: false,
                message: ex.message
            });
        }
    });
});


// สร้างเส้นทางสำหรับการบันทึกข้อมูล
app.post('/api/postorder', async (req, res) => {
    const input = req.body
    console.log(input)
    try {
        var result = await order.addorders(pool,
            input.order_item_id,
            input.user_id,
            input.total_amount,
            input.transport_id,
            input.address,
            input.city,
            input.street,
            input.zipcode,
            input.tel,);

        res.json({
            result: true,
            message:result
        });
    } catch (ex) {
        res.json({
            result: false,
            message : ex.message
        })
    }

});

//manage report
app.get('/api/getReport', checkAuth, async (req, res) => {
    try {
        var result = await user.getReport(pool)

        res.json({
            result: true,
            data: result
        })
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        })
    }
});

app.delete("/api/report/delete/:reportId", checkAuth, async (req, res) => {
    const reportId = req.params.reportId;

    try {
        var result = await user.deleteReport(pool, reportId);

        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

//manage order
app.get('/api/getOrders', checkAuth, async (req, res) => {
    try {
        var result = await order.getOrder(pool)

        res.json({
            result: true,
            data: result
        })
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        })
    }
});

app.put("/api/updateOrderStatus", checkAuth, async (req, res) => {
    const { order_id, order_status_id } = req.body;

    try {
        // Call the editOrderStatus function passing the order_id and order_status_id
        await order.editOrderStatus(pool, order_status_id, order_id);

        // Respond with a success message
        res.json({
            result: true,
            message: "Order status updated successfully"
        });
    } catch (ex) {
        // If an error occurs, log the error and respond with an error message
        console.error("Error updating order status:", ex);
        res.status(500).json({
            result: false,
            message: "An error occurred while updating order status"
        });
    }
});

app.get("/api/orderStatus", checkAuth, async (req, res) => {
    try {
        var results = await order.getOrderStatus(pool);

        res.json({
            results: true,
            data: results
        });
    } catch (ex) {
        res.json({
            results: false,
            message: ex.message
        });
    }
});

app.delete("/api/order/delete/:orderId", checkAuth, async (req, res) => {
    const orderId = req.params.orderId;

    try {
        var result = await order.deleteOrder(pool, orderId);

        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get('/api/gertranspots', async (req, res) => {
    try {
        var result = await transports.getTranspots(pool)
        res.json({
            result: true,
            data: result
        })
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        })
    }
})

//send data to port
app.listen(port, () => {
    console.log('serveruning', port)
});
