const express = require('express');
const app = express();
const port = 3000;

const publicPath = __dirname + '/public';
const indexHtmlPath = publicPath + '/index.html';

const loggingMiddleware = (req, res, next) => {
  console.log(`Methode: ${req.method}, Pfad ${req.path}, IP: ${req.ip}`);
  next();
}

const rootHandler = (req, res) => {
  res.sendFile(indexHtmlPath);
}

app.get('/', loggingMiddleware, rootHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;