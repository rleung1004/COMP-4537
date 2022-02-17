const express = require("express");
const mysql = require("mysql");
const PORT = 33334;
const app = express();
const endPointRoot = "/api";
const con = mysql.createConnection({
  host: "localhost",
  user: "lab5user",
  password: "comp4537",
  database: "lab5",
});

con.on("error", (err) => {
  console.log("[SQL Error]: ", err);
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Content-Type", "application/json");
  next();
});

app.get(endPointRoot + "/read", (req, res) => {
  con.query("SELECT * FROM score", (sqlErr, sqlRes) => {
    if (sqlErr) throw sqlErr;
    console.log(sqlRes); // logging
    const resBody = {
      message: "GET request success",
      data: sqlRes,
    };
    res.status(200).send(JSON.stringify(resBody));
  });
});

app.patch(endPointRoot + "/write", (req, res) => {
  let data = "";
  // collect chunks of data
  req.on("data", (chunk) => {
    if (chunk != null) {
      data += chunk;
    }
  });

  req.on("end", () => {
    let body = JSON.parse(data);
    const sqlQuery = `UPDATE score SET score = ${body.score} WHERE name = '${body.name}'`;
    con.query(sqlQuery, (sqlErr, sqlRes) => {
      if (sqlErr) {
        res.status(500).send({ message: `Error: ${sqlErr.message}` });
      }
      console.log(sqlRes.message); // logging
      const resBody = {
        message: `${body.name}: ${body.score} was stored in the DB`,
      };
      res.status(200).send(JSON.stringify(resBody));
    });
  });
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening to port ${PORT}`);
});
