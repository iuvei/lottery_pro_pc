// const fs = require('fs')
const path = require('path')
const express = require('express')
const compression = require('compression')
const ejs = require("ejs");
const app = express()
const routeConfig = require("./routes/routeConfig");

app.use(compression())
app.use(express.static(path.resolve(__dirname, './dist')))
app.use(express.static(path.resolve(__dirname, './static')))

app.set('views', path.join(__dirname, './views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

routeConfig.setRoute(app);

app.listen(5311)
