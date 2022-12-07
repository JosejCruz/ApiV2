const { Router } = require("express");
const router = Router();

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
router.get("/api/url/:uid", (req, res) => {
  var data = req.params.uid;
  console.log(data);
  res.json({
    message: "UID received",
  });
});

router.post("/api/estudio/", (req, res) => {
  console.log(req.body);
  const UID = req.body.UID;
  const Estudio = req.body.Estudio;
  //Copiar(UID, Estudio)
  const content = fs.readFileSync(Plantillas + Estudio + ".docx", "binary");

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render({
    Direccion: "Direccion de prueba",
    Fecha: "05-12-2022",
    Hora: "14:30 pm",
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
  //verCambios(Temporal + UID + '.txt')
  //verCambios2(Temporal)
  verCambios2(Final, UID + ".docx");
});

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
function verCambios2(UID, nombre) {
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
        } else {
          console.log("error al eliminar");
          console.log('error al subir archivo')
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

//Metodo para subir archivo a servidor
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
