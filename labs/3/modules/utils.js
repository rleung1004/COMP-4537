const fs = require('fs');

exports.getDate = () => {
  return new Date().toString();
};


exports.getFileText = (fileName) => {
  try {
    const data = fs.readFileSync(fileName, 'utf8');
    return {"status": 200, "data": data}
  } catch (err) {
    return {
      "status": 404, "data": `${fileName} doesn't exist`
    };
  }
}

exports.writeToFile = (fileName, text) => {
  fs.appendFileSync(fileName, text);
}