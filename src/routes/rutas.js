const { Router } = require("express");
const router = Router();
const db = require('../database/database.js')

//para envio de archivo
const FormData = require("form-data");
const axios = require("axios");

//Para manipulacion de archivos
const os = require("node:os");
const { exec } = require("child_process");
const { copyFile } = require("fs/promises");
const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const Plantillas = os.homedir() + "/Estudios/Templates/";
const Temporal = os.homedir() + "/Estudios/Tmp/";
const Final = os.homedir() + "/Estudios/Final/";

//RUTAS
router.get("/", (req, res) => {
  res.json({
    message: "ok",
  });
});

router.post("/", (req, res) => {
  console.log(req.body);
  res.json({
    message: "received",
  });
});

router.get("/check", (req, res) => {
  res.json({
    status: "true",
  });
});

// rutas y funciones para manipulacion de archivos
router.get("/url/:uid", (req, res) => {
  var data = req.params.uid;
  console.log(data);
  res.json({
    message: "UID received",
  });
});

router.get('/estudio/:id', (req, res)=>{
  var id = req.params.id;
  ObtenerId(id,res)
  console.log(id)
})

router.get('/estudio', (req, res)=>{
  ObtenerTodo(res)
})

router.get('/paciente', (req, res)=>{
  var Paciente = req.body.Paciente
  ObtenerNombre(Paciente, res)
})

router.put('/paciente', (req, res)=>{
  ActualizarPaciente(req, res)
})

router.delete('/paciente', (req, res)=>{
  //lambda y s3 EC2 ,dinamo db
  EliminarPaciente(req, res)
})

router.post("/estudio", (req, res) => {
  console.log(req.body);
  const UID = req.body.UID;
  const Estudio = req.body.Estudio;
  const Paciente = req.body.Paciente;
  const content = fs.readFileSync(Plantillas + Estudio + ".docx", "binary");

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render({
    UID,
    Paciente,
    Estudio
  });
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  fs.writeFileSync(Temporal + UID + ".docx", buf);
  ////////////

  exec("open " + Temporal + UID + ".docx", (error, stdout, stderr) => {
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
  });
  EscucharCambios(Final, UID + ".docx", req);
});

function EscucharCambios(UID, nombre, req) {
  fs.watchFile(UID, () => {
    console.log(`El contenido de la carpeta ${UID} ha cambiado`);
    const form = new FormData();
    form.append("file", fs.createReadStream(UID + nombre));
    axios
    .post("https://file.io", form)
    .then((res) =>{
      if (res.data.success === true) {
        eliminar(UID + nombre);
        fs.unwatchFile(UID);
        eliminar(Temporal + nombre);
        console.log("Archivo enviado");
        RegistrarDatos(req)
      }
      console.log(res.data)
    })
    .catch((err) => {
      console.log(err)
    });
  });
}
function eliminar(UID) {
  fs.unlinkSync(UID);
}

//Almacenamiento en Base de Datos

function RegistrarDatos(req) {
  const UID = req.body.UID;
  const Estudio = req.body.Estudio;
  const Paciente = req.body.Paciente;
  const Access_number = req.body.Access_number;

  var fecha = new Date();
  var FechaHoy = fecha.getDate() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getFullYear();
  var Hora = fecha.getHours() + ':' + fecha.getMinutes();
  var query = "INSERT INTO Registro (Fecha, Hora, Paciente, Estudio, UID, Access_number) VALUES (?,?,?,?,?,?)";
  db.run(query, [FechaHoy, Hora, Paciente, Estudio, UID, Access_number]);
}

function ActualizarPaciente(req, res) {
  const Paciente = req.body.Paciente;
  const Estudio = req.body.Estudio;
  const Access_number = req.body.Access_number;
  var query = 'UPDATE Registro SET Paciente = ?, Estudio = ?, Access_number = ? WHERE Access_number = ?';
  db.run(query, [Paciente, Estudio, Access_number, Access_number], function(err, result){
    if (err) {
      res.json({
        message: 'failed',
      })
    }
    res.json({
      message: 'success',
    })
  })
}

function EliminarPaciente(req, res) {
  const Access_number = req.body.Access_number;
  var query = 'DELETE FROM Registro WHERE Access_number = ?';
  db.run(query, [Access_number], function(err, result){
    if (err) {
      res.json({
        message: 'failed',
      })
    }
    res.json({
      message: 'success',
    })
  })
}

function ObtenerTodo(res) {
  var query = 'SELECT * FROM Registro'
  var params = []
  db.all(query, params,(err, rows)=>{
    if (err) {
      res.json({
        message: 'error'
      })
    }
    res.json({
      message: 'success',
      data: rows
    })
  })
}

function ObtenerId(Id, res) {
  var query = 'SELECT * FROM Registro WHERE Id_Registro = ?';
  var params = Id;
  db.get(query, params, (err, rows)=>{
    try {
      if (err) {
        res.json({
          message: 'error'
        })
      }
      if (rows != null) {
        res.json({
          message: 'success',
          data: rows
        })
      }else{
        res.json({
          message: 'Not Found',
        })
      }
    } catch (error) {
      console.log(error)
    }
  })
}

function ObtenerNombre(Paciente, res) {
  var query = 'SELECT * FROM Registro WHERE Paciente = ?';
  var params = Paciente;
  db.get(query, params, (err, rows)=>{
    try {
      if (err) {
        res.json({
          message: 'error'
        })
      }
      if (rows != null) {
        res.json({
          message: 'success',
          data: rows
        })
      }else{
        res.json({
          message: 'Not Found',
        })
      }
    } catch (error) {
      console.log(error)
    }
  })
}

//Metodos Descartados
async function Copiar(UID, Estudio) {
  try {
    await copyFile(Plantillas + Estudio + ".docx", Temporal + UID + ".docx");
    console.log("Archivo copiado");
  } catch (error) {
    console.log("error");
    res.json({
      message: "error",
    });
  }
}
function verCambios(UID) {
  fs.watch(UID, (event, filename) => {
    console.log(`${filename} archivos modificado`);
  });
}
function SubirArchivo(Archivo) {
  const form = new FormData();
  form.append("file", fs.createReadStream(Archivo));
  console.log("Archivo enviado");
  axios
  .post("https://file.io", form)
  .then((res) =>{
    console.log(res.data)
    return true;
  })
  .catch((err) => {
    console.log(err)
    return false;
  });
}

module.exports = router;
