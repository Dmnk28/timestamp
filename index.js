const express = require('express');
const app = express();
const port = 3000;

const publicPath = __dirname + '/public';
const indexHtmlPath = publicPath + '/index.html';


const loggingMiddleware = (req, res, next) => {
  console.log(`Methode: ${req.method}, Pfad ${req.path}, IP: ${req.ip}`);
  next();
}

const timeMiddleware = (req, res, next) => {
  const passedValue = req.params.time;
  if (passedValue.match(/-/gi)) {
    res.locals.unix  = Date.parse(passedValue);
    res.locals.utc   = new Date(passedValue).toUTCString();
  };
  if (!passedValue.match(/\D/g)) {
    res.locals.unix  = Number(passedValue);

    const millisecTimestamp = new Date(res.locals.unix * 1000); // Using milliseconds for the Date Constructor
    const year = millisecTimestamp.getFullYear();
    const month = millisecTimestamp.getMonth();
    const date = millisecTimestamp.getDate();
    const hours = millisecTimestamp.getHours();
    const minutes = millisecTimestamp.getMinutes();
    const seconds = millisecTimestamp.getSeconds();
    
    res.locals.utc   = new Date(year, month, date, hours, minutes, seconds).toUTCString();
  }
  console.log(req.params, !passedValue.match(/\D/g));
  next();
}

const rootHandler = (req, res) => {
  res.sendFile(indexHtmlPath);
}

const timeHandler = (req, res) => {
  res.json({
    unix: res.locals.unix, 
    utc: res.locals.utc});
}

app.get('/', loggingMiddleware, rootHandler);
app.use('/public', express.static(publicPath));
app.get('/api/:time', timeMiddleware, timeHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})