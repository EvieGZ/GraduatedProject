const mysql = require("mysql");

module.exports = {

    getSizeType: async (pool) => {

        var sql = "SELECT * FROM size_types";
        return await pool.query(sql);
    },
    getSize: async (pool, sizeTypeId) => {

        var sql = "SELECT * FROM size WHERE size_type_id = ?";
        return await pool.query(sql, [sizeTypeId]);
    },

    getGender: async (pool) => {

        var sql = "SELECT * FROM gender";
        return await pool.query(sql);
    },

    getCategory: async (pool) => {

        var sql = `SELECT * FROM category`;
        return await pool.query(sql);

    },

    getSubCategory: async (pool, categoryId) => {

        var sql = `SELECT * FROM subcategory WHERE category_id = ?`;
        return await pool.query(sql, [categoryId]);
    },

    getColor: async (pool) => {

        var sql = "SELECT * FROM color";
        return await pool.query(sql);
    },

    getBrand: async (pool) => {

        var sql = "SELECT * FROM brands";
        return await pool.query(sql);
    },

    getAllProducts: async (pool) => {

        var sql = "SELECT * FROM products";
        return await pool.query(sql);
    },

    getProductList: async (pool) => {

        var sql = `
            SELECT 
                a.*, 
                b.gender_name AS gender_name,
                c.category_name AS category_name,
                d.subcategory_name AS subcategory_name,
                e.size_name AS size_name,
                f.color_name AS color_name,
                g.brand_name AS brand_name
            FROM products a
            JOIN gender b ON a.gender_id = b.gender_id
            JOIN category c ON a.category_id = c.category_id
            JOIN subcategory d ON a.subcategory_id = d.subcategory_id
            JOIN size e ON a.size_id = e.size_id
            JOIN color f ON a.color_id = f.color_id
            JOIN brands g ON a.brand_id = g.brand_id`;
        return await pool.query(sql);
    },

    getTopCategory: async (pool) => {

        var sql = `
            SELECT 
                a.*, 
                b.gender_name AS gender_name,
                c.category_name AS category_name,
                d.subcategory_name AS subcategory_name,
                e.size_name AS size_name,
                f.color_name AS color_name,
                g.brand_name AS brand_name
            FROM products a
            JOIN gender b ON a.gender_id = b.gender_id
            JOIN category c ON a.category_id = c.category_id
            JOIN subcategory d ON a.subcategory_id = d.subcategory_id
            JOIN size e ON a.size_id = e.size_id
            JOIN color f ON a.color_id = f.color_id
            JOIN brands g ON a.brand_id = g.brand_id WHERE c.category_id = 1`;
        return await pool.query(sql);
    },
    getFullBodyCategory: async (pool) => {

        var sql = `
            SELECT 
                a.*, 
                b.gender_name AS gender_name,
                c.category_name AS category_name,
                d.subcategory_name AS subcategory_name,
                e.size_name AS size_name,
                f.color_name AS color_name,
                g.brand_name AS brand_name
            FROM products a
            JOIN gender b ON a.gender_id = b.gender_id
            JOIN category c ON a.category_id = c.category_id
            JOIN subcategory d ON a.subcategory_id = d.subcategory_id
            JOIN size e ON a.size_id = e.size_id
            JOIN color f ON a.color_id = f.color_id
            JOIN brands g ON a.brand_id = g.brand_id WHERE c.category_id = 2`;
        return await pool.query(sql);
    },

    getBottomCategory: async (pool) => {

        var sql = `
            SELECT 
                a.*, 
                b.gender_name AS gender_name,
                c.category_name AS category_name,
                d.subcategory_name AS subcategory_name,
                e.size_name AS size_name,
                f.color_name AS color_name,
                g.brand_name AS brand_name
            FROM products a
            JOIN gender b ON a.gender_id = b.gender_id
            JOIN category c ON a.category_id = c.category_id
            JOIN subcategory d ON a.subcategory_id = d.subcategory_id
            JOIN size e ON a.size_id = e.size_id
            JOIN color f ON a.color_id = f.color_id
            JOIN brands g ON a.brand_id = g.brand_id WHERE c.category_id = 3`;
        return await pool.query(sql);
    },

    getAccessoryCategory: async (pool) => {

        var sql = `
            SELECT 
                a.*, 
                b.gender_name AS gender_name,
                c.category_name AS category_name,
                d.subcategory_name AS subcategory_name,
                e.size_name AS size_name,
                f.color_name AS color_name,
                g.brand_name AS brand_name
            FROM products a
            JOIN gender b ON a.gender_id = b.gender_id
            JOIN category c ON a.category_id = c.category_id
            JOIN subcategory d ON a.subcategory_id = d.subcategory_id
            JOIN size e ON a.size_id = e.size_id
            JOIN color f ON a.color_id = f.color_id
            JOIN brands g ON a.brand_id = g.brand_id WHERE c.category_id = 4`;
        return await pool.query(sql);
    },

    getShoeCategory: async (pool) => {

        var sql = `
            SELECT 
                a.*, 
                b.gender_name AS gender_name,
                c.category_name AS category_name,
                d.subcategory_name AS subcategory_name,
                e.size_name AS size_name,
                f.color_name AS color_name,
                g.brand_name AS brand_name
            FROM products a
            JOIN gender b ON a.gender_id = b.gender_id
            JOIN category c ON a.category_id = c.category_id
            JOIN subcategory d ON a.subcategory_id = d.subcategory_id
            JOIN size e ON a.size_id = e.size_id
            JOIN color f ON a.color_id = f.color_id
            JOIN brands g ON a.brand_id = g.brand_id WHERE c.category_id = 5`;
        return await pool.query(sql);
    },

    getHatCategory: async (pool) => {

        var sql = `
            SELECT 
                a.*, 
                b.gender_name AS gender_name,
                c.category_name AS category_name,
                d.subcategory_name AS subcategory_name,
                e.size_name AS size_name,
                f.color_name AS color_name,
                g.brand_name AS brand_name
            FROM products a
            JOIN gender b ON a.gender_id = b.gender_id
            JOIN category c ON a.category_id = c.category_id
            JOIN subcategory d ON a.subcategory_id = d.subcategory_id
            JOIN size e ON a.size_id = e.size_id
            JOIN color f ON a.color_id = f.color_id
            JOIN brands g ON a.brand_id = g.brand_id WHERE c.category_id = 6`;
        return await pool.query(sql);
    },

    getSwimwearCategory: async (pool) => {

        var sql = `
            SELECT 
                a.*, 
                b.gender_name AS gender_name,
                c.category_name AS category_name,
                d.subcategory_name AS subcategory_name,
                e.size_name AS size_name,
                f.color_name AS color_name,
                g.brand_name AS brand_name
            FROM products a
            JOIN gender b ON a.gender_id = b.gender_id
            JOIN category c ON a.category_id = c.category_id
            JOIN subcategory d ON a.subcategory_id = d.subcategory_id
            JOIN size e ON a.size_id = e.size_id
            JOIN color f ON a.color_id = f.color_id
            JOIN brands g ON a.brand_id = g.brand_id WHERE c.category_id = 7`;
        return await pool.query(sql);
    },

    addProduct: async (pool, product_name, gender_id, category_id, subCategory_id, product_price, product_stock, img_url, size_id, color_id, product_descript, brand_id) => {
        var sql = `INSERT INTO products (product_name, gender_id, category_id, subcategory_id, product_price, product_stock, img_url, size_id, color_id, product_description, brand_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        sql = mysql.format(sql, [product_name, gender_id, category_id, subCategory_id, product_price, product_stock, img_url, size_id, color_id, product_descript, brand_id]);

        return await pool.query(sql);
    },

    getByProductId: async (pool, productId) => {

        const sql = `SELECT * FROM products WHERE product_id = ?`;
        return await pool.query(sql, [productId]);

    },



    updateProduct: async (pool, product_id, product_name, gender_id, category_id, subCategory_id, product_price, product_stock, size_id, color_id, product_description, brand_id) => {
        var sql = `UPDATE products SET `
            + `product_name = ?, `
            + `gender_id = ?, `
            + `category_id = ?, `
            + `subcategory_id = ?, `
            + `product_price = ?, `
            + `product_stock = ?, `
            + `size_id = ?, `
            + `color_id = ?, `
            + `product_description = ?, `
            + `brand_id = ? `
            + `WHERE product_id = ?`;
        sql = mysql.format(sql, [product_name, gender_id, category_id, subCategory_id, product_price, product_stock, size_id, color_id, product_description, brand_id, product_id]);
    
        return await pool.query(sql);
    },
    
    deleteProduct: async (pool, productId) => {
        var sql = "DELETE FROM products WHERE product_id = ?";
        sql = mysql.format(sql, [productId]);

        return await pool.query(sql);
    },

}

