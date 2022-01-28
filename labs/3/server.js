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

const writeFileHandler = (req, res) => {
  const fileName = "file.txt";
  let text = "\n" + url.parse(req.url, true).query.text;
  if (!text) {
    text = "\n";
  }

  utils.writeToFile(fileName, text);
  res.writeHead(200, { "Content-Type": "text/html"});
  res.write("Text appended to file.txt");
  res.end();
}

const readFileHandler = (req, res) => {
  const fileName = req.url.substring(req.url.lastIndexOf('/') + 1);
  if (!fileName) {
    fileName = "";
  }

  let fileData = utils.getFileText(fileName);

  res.writeHead(fileData["status"], { "Content-Type": "text/html"});
  res.write(fileData["data"]);
  res.end();
}

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
  } else if (req.url.startsWith("/writeFile")) {
    writeFileHandler(req, res);
  } else if (req.url.startsWith("/readFile")) {
    readFileHandler(req, res);
  } else {
    notFoundHandler(req, res);
  }
});

server.listen(PORT_NUMBER, () => {
  console.log(`Server listening on port ${PORT_NUMBER}...`);
});
