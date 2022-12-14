var sqlite3 = require("sqlite3").verbose();
var md5 = require("md5");

const DBSOURCE = "./src/database/db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.log(err.message);
    throw err;
  } else {
    console.log("Conexion exitosa");
    db.run(
      `CREATE TABLE IF NOT EXISTS Registro (
            Id_Registro INTEGER PRIMARY KEY AUTOINCREMENT,
            Fecha text,
            Hora text,
            Paciente text, 
            Estudio text,
            UID text,
            Access_number text
            )`,
      (err) => {
        if (err) {
          // error al crear una tabla
          console.log(err)
        } else {
          // crear datos
          var insert =
            "INSERT INTO Registro (Fecha, Hora, Paciente, Estudio, UID, Access_number) VALUES (?,?,?,?,?,?)";
          //db.run(insert, ["admin", "admin@example.com", md5("admin123456")]);
          db.run(insert, ["21-12-2022", "13:00", "Paciente Prueba", "Estudio de Prueba", "61c07fce-aec7-4be4-bac2-ecee83bd27f0", "1546545"]);
          console.log('Datos insertados')
        }
      }
    );
  }
});
module.exports = db;
