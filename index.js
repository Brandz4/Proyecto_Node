//Dependencies
const morgan = require('morgan');
const express = require('express');
const app = express(); 

//Rutas: 
const user = require('./routes/user');

//Middleware
const auth = require('./middleware/auth');
const notFound = require('./middleware/notFound'); 
const index = require('./middleware/index');
const cors = require('./middleware/cors');

app.use(cors); 
//Dependencia para el desarrollo:
app.use(morgan('dev'));
//Para manejar jsons: 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Uso de rutas: 
// Rutas públicas
app.get("/", index);
app.use("/user", (req, res, next) => {
    if (req.path === '/login') {
        next(); // No requiere autenticación para login 
    } else {
        auth(req, res, next); // Requiere autenticación para otras rutas
    }
}, user);

// Middleware para rutas incorrectas
app.use(notFound);

//Levantar el servidor:
app.listen(process.env.PORT || 3000, () => {
    console.log('Server running in port 3000');
});
