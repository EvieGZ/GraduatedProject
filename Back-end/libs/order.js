const mysql = require("mysql");

module.exports = {
    getOrder:async(pool)=>{
        var sql = `SELECT 
                    a.*, 
                    b.username AS username,
                    b.firstname AS firstname,
                    b.lastname AS lastname,
                    b.email AS email,
                    c.transport_name AS transport_name,
                    d.quantity AS quantity,
                    e.product_name AS product_name,
                    e.img_url AS img_url,
                    f.size_name AS size_name,
                    g.color_name AS color_name,
                    h.subcategory_name AS subcategory_name,
                    i.brand_name AS brand_name,
                    j.order_status_name AS order_status_name
            FROM orders a
            JOIN user b ON a.user_id = b.user_id
            JOIN transports c ON a.transport_id = c.transport_id
            JOIN order_items d ON a.order_item_id = d.order_item_id
            JOIN products e ON d.product_id = e.product_id
            JOIN size f ON e.size_id = f.size_id
            JOIN color g ON e.color_id = g.color_id
            JOIN subcategory h ON e.subcategory_id = h.subcategory_id
            JOIN brands i ON e.brand_id = i.brand_id
            JOIN order_status j ON a.order_status_id = j.order_status_id
            ORDER BY a.order_id ASC`
        return await pool.query(sql);
    },
    
    getOrderStatus : async(pool) => {
        var sql = `SELECT * FROM order_status`
        return await pool.query(sql)
    },

    deleteOrder: async (pool, orderId) => {
        var sql = "DELETE FROM orders WHERE order_id = ?";
        sql = mysql.format(sql, [orderId]);

        return await pool.query(sql);
    },
    
    addorders : async(pool ,order_item_id, user_id, total_amount,transport_id , address, city, street, zipcode, tel, orderStatusId	)=>{
        var sql = `INSERT INTO orders (order_item_id, user_id, total_amount,transport_id , address, city, street, zipcode, tel, order_status_id)
                    VALUES(?,?,?,?,?,?,?,?,?,1)`
        sql = mysql.format(sql , [order_item_id, user_id, total_amount,transport_id , address, city, street, zipcode, tel, orderStatusId])

        return await pool.query(sql);          
    },
    
    editOrderStatus: async (pool, orderStatusId, orderId) => {
        var sql = `UPDATE orders SET order_status_id = ? WHERE order_id = ?`;
        sql = mysql.format(sql, [orderStatusId, orderId]);
        
        return await pool.query(sql);
    }

}