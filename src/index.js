const { urlencoded } = require('express');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
// //Creando carpetas
// var Carpetas = require('./templates/dir.js')
// Carpetas()

//configuracion
const puerto = JSON.parse(fs.readFileSync(path.join(__dirname,"../configuacion.json"), 'utf8')).puerto ;
app.use(cors());
app.set('port', process.env.PORT || puerto)
app.use(urlencoded({extended: false}));
app.use(express.json());

//Rutas
app.use("/api",require('./routes/rutas'))

//Iniciando servidor
app.listen(app.get('port'), ()=>{
    console.log('Servidor iniciado',app.get("port"))
});
