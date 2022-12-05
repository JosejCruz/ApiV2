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
      `CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text, 
            password textoo
            )`,
      (err) => {
        if (err) {
          // error al crear una tabla
        } else {
          // crear datos
          var insert =
            "INSERT INTO user (name, email, password) VALUES (?,?,?)";
          db.run(insert, ["admin", "admin@example.com", md5("admin123456")]);
          db.run(insert, ["user", "user@example.com", md5("user123456")]);
        }
      }
    );
  }
});
module.exports = db;
