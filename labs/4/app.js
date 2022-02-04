const http = require("http");
const url = require("url");

const PORT_NUMBER = 3030;
const validWordPattern = new RegExp("[A-Za-z'-]+");

const GET = "GET";
const POST = "POST";
const endPointRoot = "/api/definitions";

const dictionary = new Object();
let requestCount = 0;

const defaultHeader = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST",
};

const notFoundHandler = (req, res) => {
  res.writeHead(404, defaultHeader);
  res.end(JSON.stringify({ message: "Not Found", requestCount }));
};

const badRequestHandler = (req, res) => {
  res.writeHead(404, defaultHeader);
  res.end(JSON.stringify({ message: "Bad Request", requestCount }));
};

const getEndpoint = (req, res) => {
  const word = url.parse(req.url, true).query.word;
  if (!word) {
    notFoundHandler(req, res);
  } else if (!dictionary.hasOwnProperty(word)) {
    notFoundHandler(req, res);
  } else {
    res.writeHeader(200, defaultHeader);
    let body = {
      word,
      definition: dictionary[word],
      requestCount,
    };
    res.end(JSON.stringify(body));
  }
};

const postEndpoint = (req, res) => {
  let reqData = "";
  req.on("data", (chunk) => {
    if (chunk != null) {
      reqData += chunk;
    }
  });
  req.on("end", () => {
    let reqBody = JSON.parse(reqData);
    if (!reqBody.word || !reqBody.definition) {
      badRequestHandler(req, res);
    } else if (!validWordPattern.test(reqBody.word)) {
      badRequestHandler(req, res);
    } else if (dictionary.hasOwnProperty(reqBody.word)) {
      res.writeHead(409, defaultHeader);
      res.end(
        JSON.stringify({
          message: `${reqBody.word} already exists.`,
          requestCount,
        })
      );
    } else {
      dictionary[reqBody.word] = reqBody.definition;
      res.writeHeader(200, defaultHeader);
      const resBody = {
        message: "New entry recorded.",
        recorded: `${reqBody.word}: ${reqBody.definition}`,
        requestCount,
      };
      res.end(JSON.stringify(resBody));
    }
  });
};

const server = http.createServer((req, res) => {
  requestCount++;
  if (req.method === GET && req.url.startsWith(endPointRoot)) {
    getEndpoint(req, res);
  } else if (req.method === POST && req.url.startsWith(endPointRoot)) {
    postEndpoint(req, res);
  } else {
    notFoundHandler(req, res);
  }
});

server.listen(PORT_NUMBER, () => {
  console.log(`Server listening on port ${PORT_NUMBER}...`);
});
