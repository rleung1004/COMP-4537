const http = require("http");
const url = require("url");
const utils = require("./modules/utils");

const baseHandler = (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(`
            <h1>Lab 3 Available Endpoints</h1>
            <h2>/getDate/?{name}</h2>
            <h2>/writeFile/?{text}</h2>
            <h2>/readFile/{file name}</h2>
        `);
  res.end();
};

const getDateHandler = (req, res) => {
  let name = url.parse(req.url, true).query.name;
  if (!name) {
    name = "";
  }
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(
    `<p style='color: blue'>
        <b>Hello ${name}, What a beautiful day. Server current date and time is ${utils.getDate()}</b>
       </p>`
  );
  res.end();
};

const notFoundHandler = (req, res) => {
  res.writeHead(404, { "Content-Type": "text/html" });
  res.write(`
      <h1>Error 404 Not Found</h1>
      `);
  res.end();
};

const PORT_NUMBER = 33333;
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    baseHandler(req, res);
  } else if (req.url.startsWith("/getDate")) {
    getDateHandler(req, res);
  } else {
    notFoundHandler(req, res);
  }
});

server.listen(PORT_NUMBER, () => {
  console.log(`Server listening on port ${PORT_NUMBER}...`);
});
