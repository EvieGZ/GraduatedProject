const mysql = require("mysql");

module.exports ={
    getTranspots:async(pool)=>{
        var sql = "SELECT * FROM transports"
        return await pool.query(sql)
    }
}