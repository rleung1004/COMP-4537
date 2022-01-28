const http = require("http");
const url = require("url");
const { getDate } = require("./modules/utils");

const PORT_NUMBER = 33333;
http
  .createServer(function (req, res) {
    let name = url.parse(req.url, true).query.name;
    if (!name) {
      name = "";
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(
      `<p style='color: blue'>
        <b>Hello ${name}, What a beautiful day. Server current date and time is ${getDate()}</b>
       </p>`
    );
    res.end();
  })
  .listen(PORT_NUMBER);

console.log(`Server listening on port ${PORT_NUMBER}...`);
