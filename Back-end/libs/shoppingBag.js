const mysql = require("mysql");

module.exports =  {

    getOderItem: async (pool) => {

        var sql = "SELECT * FROM order_items";
        return await pool.query(sql);
    },

    getOder: async (pool) => {

        var sql = "SELECT * FROM orders";
        return await pool.query(sql);
    },

    getFav: async (pool) => {

        var sql = "SELECT * FROM favorites";
        return await pool.query(sql);
    },

    getBagItem: async (pool) => {

        var sql = `
            SELECT 
                a.*, 
                b.product_name AS product_name ,
                b.img_url AS img_url
            FROM order_items a
            JOIN products b ON a.product_id = b.product_id`;
        return await pool.query(sql);
    },

    getBagItemByUserId: async (pool, userId) => {
        var sql = `
            SELECT 
                a.*, 
                b.product_name AS product_name ,
                b.img_url AS img_url
            FROM order_items a
            JOIN products b ON a.product_id = b.product_id WHERE user_id = ?`;
        return await pool.query(sql, [userId]);
    },

    getAllFav: async (pool) => {

        var sql = `
        SELECT 
        a.*,
        b.*,
        c.gender_name AS gender_name,
        d.category_name AS category_name,
        e.subcategory_name AS subcategory_name,
        f.size_name AS size_name,
        g.color_name AS color_name,
        h.brand_name AS brand_name
    FROM 
        favorites AS a
    JOIN 
        products AS b ON a.product_id = b.product_id
    JOIN 
        gender AS c ON b.gender_id = c.gender_id
    JOIN 
        category AS d ON b.category_id = d.category_id
    JOIN 
        subcategory AS e ON b.subcategory_id = e.subcategory_id
    JOIN 
        size AS f ON b.size_id = f.size_id
    JOIN 
        color AS g ON b.color_id = g.color_id
    JOIN 
        brands AS h ON b.brand_id = h.brand_id
    `;
        return await pool.query(sql);
    }
}