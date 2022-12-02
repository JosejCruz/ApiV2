const { Router } = require('express')
const router = Router();

//Para manipulacion de archivos
const os = require("node:os");
const { exec } = require("child_process");
const { copyFile } = require("fs/promises");
const  fs  = require("fs");
const dirTemplates = os.homedir() + '/Documents/GitHub/DocumentosPrueba/';
const Plantillas = os.homedir() + '/Documents/Pruebas/Plantillas/';
const Temporal = os.homedir() + '/Documents/Pruebas/Tmp/';
const Final = os.homedir() + '/Documents/Pruebas/Final/';

//RUTAS
router.get('/', (req, res) =>{
    res.json({
        message: 'ok'
    })
})

router.post('/', (req, res)=>{
    console.log(req.body);
    res.json({
        message: 'received'
    })
})

// rutas y funciones para manipulacion de archivos
router.get('/api/url/:uid', (req, res) =>{
    var data = req.params.uid
    console.log(data)
    res.json({
        message: 'UID received'
    })
})

router.post('/api/prueba/', (req, res)=>{
    console.log(req.body);
    const UID = req.body.UID
    const Estudio = req.body.Estudio
    Copiar(UID, Estudio)
    exec ("open " + Temporal + UID + '.txt', (error, stdout, stderr) => {
        if (error) {
        res.json({
            status: "Not Found",
        });
        }
        if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
        }
        res.json({
        status: "Open",
        });
    })
    //verCambios(Temporal + UID + '.txt')
    //verCambios2(Temporal)
    verCambios2(Final)
})

async function Copiar(UID, Estudio){
    try {
        await copyFile(Plantillas + Estudio + '.txt', Temporal + UID + '.txt')
        console.log('Archivo copiado')
    } catch (error) {
        console.log('error')
        res.json({
            message: 'error'
        })
    }
}
function verCambios(UID){
    fs.watch(UID, (event, filename)=>{
        console.log(`${filename} archivos modificado`)
    })
}
function verCambios2(UID){
    fs.watchFile(UID, () => {
        console.log(`El contenido de la carpeta ${UID} ha cambiado`);
    });
}
function eliminar(UID){
    fs.unlinkSync(UID)
}

function SubirArchivo(Archivo){
    //Metodo para subir archivo a servidor
}

module.exports = router;