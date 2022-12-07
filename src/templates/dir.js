const os = require("node:os");
const { exec } = require("child_process");
const  fs  = require("fs");

const sistema = os.platform();
const dirHome = os.homedir();

function CarpetasMacLinux() {
  const instrucciones =
    "cd " +
    dirHome +
    " && mkdir Estudios && mkdir Estudios/Templates && mkdir Estudios/Tmp && mkdir Estudios/Final";
  const copiarplantillas =
    "cp ./src/templates/docs/* " + dirHome + "/Estudios/Templates";
  exec(instrucciones, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log("carpetas creadas");
  });
  exec(copiarplantillas, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log("plantillas copiadas");
  });
}
function CarpetasWindows() {
  const instrucciones =
    "cd " +
    dirHome +
    " && mkdir Estudios && mkdir Estudios/Templates && mkdir Estudios/Tmp && mkdir Estudios/Final";
  const copiarplantillas =
    "copy ./src/templates/docs/* " + dirHome + "/Estudios/Templates";
  exec(instrucciones, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log("carpetas creadas");
  });
  exec(copiarplantillas, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log("plantillas copiadas");
  });
}

const Carpetas = () => {
  switch (sistema) {
    case "darwin":
      if (!fs.existsSync(dirHome + "/Estudios/")) {
          console.log("Creando carpetas");
          console.log(sistema);
          CarpetasMacLinux();
      } else {
        console.log("Las carpetas existen");
      }
      break;
    case "win32":
        if (!fs.existsSync(dirHome + "/Estudios/")) {
            console.log("Creando carpetas");
            console.log(sistema);
            CarpetasWindows();
        } else {
          console.log("Las carpetas existen");
        }
      break;
    default:
      console.log("sin datos");
      break;
  }
};

module.exports = Carpetas;
