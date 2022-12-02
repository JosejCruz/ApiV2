const { urlencoded } = require('express');
const express = require('express');
const app = express();

//configuracion
const puerto = 3000;
app.set('port', process.env.PORT || puerto)
app.use(urlencoded({extended: false}));
app.use(express.json());

//Rutas
app.use(require('./routes/rutas'))

//Iniciando servidor
app.listen(app.get('port'), ()=>{
    console.log('Servidor iniciado')
});