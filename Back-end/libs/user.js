const mysql = require("mysql");

module.exports = {

    getRole: async (pool) => {
        var sql = "SELECT * FROM role";
        return await pool.query(sql);
    },

    getUser: async (pool) => {
        var sql = "SELECT * FROM user";
        return await pool.query(sql);
    },

    createCustomer: async (pool, username, firstname, lastname, email, phoneNum, password) => {

        var sql = "INSERT INTO user (username, firstname, lastname, email, phoneNum, password, role_id) VALUES ( ?, ?, ?, ?, ?, MD5(?), ?)";

            sql = mysql.format(sql, 
            [
                username, firstname, lastname, email, phoneNum
                ,password, 3
            ]);

        return await pool.query(sql);
    },

    getReport: async (pool) => {
        var sql = `SELECT * FROM customerservice_report`;
        return await pool.query(sql);
    },

    deleteReport: async (pool) => {
        var sql = "DELETE FROM customerservice_report WHERE report_id = ?";
        sql = mysql.format(sql, [reportId]);

        return await pool.query(sql);
    }
}