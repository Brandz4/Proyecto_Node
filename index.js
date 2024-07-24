//Dependencies
const morgan = require('morgan');
const express = require('express');
const app = express(); 

//Rutas: 

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
app.get("/", index);

//Middleware para rutas incorrecta: 
app.use(notFound);

//Para levantar un servidor se utiliza el .listen, con dos parámetros, el puerto y la función a ejecutar cuando el servidor esté funcionando. 
app.listen(process.env.PORT || 3000, () => {
    console.log('Server running in port 3000');
});
