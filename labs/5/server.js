const express = require("express");
const mysql = require("mysql");
const PORT = 33334;
const OK = 200;
const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;
const RECONNECT_TIMER = 2000;
const app = express();
const endPointRoot = "/api";
const dbConfig = {
  host: "localhost",
  user: "lab5user",
  password: "comp4537",
  database: "lab5",
};
let db;

const dbConnect = () => {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.log("Error when connecting to db:", err);
      setTimeout(dbConnect, RECONNECT_TIMER);
    }
  });
  db.on("error", (err) => {
    console.log("[SQL Error]: ", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      dbConnect();
    }
  });
};

const queryDB = (query) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const validRequestBody = (body, err) => {
  if (!body.name || !body.score) {
    Object.assign(err, { message: "Error: name or score not defined" });
    return false;
  } else if (typeof body.score !== "number") {
    Object.assign(err, { message: "Error: score must be a number" });
    return false;
  }
  return true;
};

dbConnect();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Content-Type", "application/json");
  next();
});

app.get(endPointRoot + "/read", (req, res, next) => {
  queryDB("SELECT * FROM score")
    .then((result) => {
      console.log(result); // logging
      const resBody = {
        message: "GET request success",
        data: result,
      };
      res.status(OK).send(JSON.stringify(resBody));
    })
    .catch((err) => {
      next(err);
    });
});

app.post(endPointRoot + "/write", (req, res, next) => {
  let data = "";
  // collect chunks of data
  req.on("data", (chunk) => {
    if (chunk != null) {
      data += chunk;
    }
  });

  req.on("end", () => {
    let body = JSON.parse(data);
    const errMsg = {};
    if (!validRequestBody(body, errMsg)) {
      res.status(BAD_REQUEST);
      res.send({
        message: errMsg.message,
      });
    }

    const sqlQuery = `INSERT INTO score(name, score) VALUES ('${body.name}', ${body.score})`;
    queryDB(sqlQuery)
      .then((result) => {
        console.log(result); // logging
        const resBody = {
          message: `${body.name}: ${body.score} was stored in the DB`,
        };
        res.status(OK).send(JSON.stringify(resBody));
      })
      .catch((err) => {
        next(err);
      });
  });
});

app.use((err, req, res, next) => {
  const statusCode =
    res.statusCode !== OK ? res.statusCode : INTERNAL_SERVER_ERROR;
  res.status(statusCode);
  res.send({
    message: err.message,
  });
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening to port ${PORT}`);
});
