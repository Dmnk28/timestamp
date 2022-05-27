const express = require('express');
const app = express();
const port = 3000;

// use cors so the project is testable by freeCodeCamp
const cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));

const publicPath = __dirname + '/public';
const indexHtmlPath = publicPath + '/index.html';

const buildUtcFromUnix = (unixTime) => {
  const timestamp = new Date(unixTime); 
  const year = timestamp.getFullYear();
  const month = timestamp.getMonth();
  const date = timestamp.getDate();
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  const seconds = timestamp.getSeconds();
  return new Date(year, month, date, hours, minutes, seconds).toUTCString();
}

const loggingMiddleware = (req, res, next) => {
  console.log(`Methode: ${req.method}, Pfad ${req.path}, IP: ${req.ip}`);
  next();
}

const timeMiddleware = (req, res, next) => {
  const passedValue = req.params.time;
  if (!passedValue) {
    res.locals.unix = Date.now();
    res.locals.utc = buildUtcFromUnix(res.locals.unix);
  } else if (!passedValue.match(/\D/g)) {
    res.locals.unix  = Number(passedValue);
    res.locals.utc = buildUtcFromUnix(res.locals.unix);
  } else {
    res.locals.unix  = Date.parse(passedValue);
    res.locals.utc   = new Date(passedValue).toUTCString();
  }
  next();
}

const rootHandler = (req, res) => {
  res.sendFile(indexHtmlPath);
}

const timeHandler = (req, res) => {
  if (res.locals.utc == "Invalid Date") {
    res.json({ error : "Invalid Date" });
  }
  res.json({
    unix: res.locals.unix, 
    utc: res.locals.utc});
}

app.get('/', /*loggingMiddleware,*/ rootHandler);
app.use('/public', express.static(publicPath));
app.get('/api/:time?', timeMiddleware, timeHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})