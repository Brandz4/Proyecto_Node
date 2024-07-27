const express = require('express');
const jwt = require('jsonwebtoken');
const user = express.Router();
const db = require('../config/db');

//Ruta del login: 
user.post("/login", async (req, res, next) => {
    const {user_mail, user_password} = req.body;

    if(user_mail && user_password){
        const query = `SELECT * FROM empleados WHERE user_mail = '${user_mail}' AND user_password = '${user_password}';`;
        const rows = await db.query(query); 

        if(rows.length == 1){
            const token = jwt.sign({
                user_id: rows[0].user_id,
                user_mail: rows[0].user_mail, 
                user_name: rows[0].user_name, 
                user_last_name: rows[0].user_last_name
            }, "debugkey");
            return res.status(200).json({ code: 200, message: token});
        }else {
            return res.status(200).json({ code: 401, message: "Incorrect mail and/or password"});
        }
    }
    return res.status(500).json({ code: 500, message: "Incomplete fields"});
});

//Ruta para registrar empleado
user.post("/signin", async (req, res, next) => {
    const {user_name, user_last_name, user_phone, user_mail, user_password, user_address} = req.body; 

    if(user_name && user_last_name && user_phone && user_mail && user_password && user_address){
        const query = `INSERT INTO empleados (user_name, user_last_name, user_phone, user_mail, user_password, user_address)` + 
    ` VALUES ('${user_name}', '${user_last_name}', '${user_phone}', '${user_mail}', '${user_password}', '${user_address}')`;
    
    const rows = await db.query(query);

    return (rows.affectedRows == 1) ? res.status(201).json({ code: 201, message: "User registered correctly"}) :
    res.status(500).json({ code: 500, message: "Error"});
    } 
    return res.status(500).json({ code: 500, message: "Incomplete fields"});
});

//Ruta para obtener datos del empleado logeado: 
user.get("/getUserInfo/:user_id", async (req, res, next) => {
    const user_id  = req.params.user_id;

    if (user_id) {
        const query = `SELECT user_name, user_last_name FROM empleados WHERE user_id = ${user_id}`;
        const rows = await db.query(query);

        return (rows.length > 0) ? res.status(200).json({ code: 200, message: "User info retrieved successfully", user: rows[0] }) :
        res.status(404).json({ code: 404, message: "User not found" });
    } else {
        res.status(400).json({ code: 400, message: "The user id is necessary" });
    }
});

//Ruta para modificar los datos del empleado
user.put("/update", async (req, res, next) => {
    const { user_id, user_name, user_last_name, user_phone, user_mail, user_address } = req.body;

    if (user_id && user_name && user_last_name && user_phone && user_mail && user_address) {
        const query = `UPDATE empleados SET
        user_name = '${user_name}',
        user_last_name = '${user_last_name}',
        user_phone = '${user_phone}',
        user_mail = '${user_mail}',
        user_address = '${user_address}'
        WHERE user_id = ${user_id}`;

        const rows = await db.query(query);

        return (rows.affectedRows > 0) ? res.status(200).json({ code: 200, message: "User updated correctly" }) :
        res.status(404).json({ code: 404, message: "User not found" });
    }
    
    return res.status(400).json({ code: 400, message: "Incomplete fields or missing ID" });
});

//Ruta para eliminar un empleado
user.delete('/delete', async (req, res) => {
    const { user_id } = req.body; 

    if (user_id) {
        const query = `DELETE FROM empleados WHERE user_id = ?`;
        const result = await db.query(query, [user_id]);

        (result.affectedRows > 0) ? res.status(200).json({ code: 201, message: 'User eliminated correctly' }) : 
        res.status(404).json({ code: 404, message: 'User not found' });

    } else {
        res.status(400).json({ code: 400, message: 'The user id is necessary' });
    }
});

//Ruta para obtener los datos de los empleados:
user.get("/empleados", async (req, res, next) => { 

    const query = `SELECT * FROM empleados`;
    
    const rows = await db.query(query);

    return res.status(200).json({ code: 200, message: rows});
});

//Para exportar: 
module.exports = user; 
