const express = require('express');
const path = require('path');

const app = express();

// ejs 相关
app.engine('.html', require('ejs').__express);

app.set('view engine', 'html');

// 静态文件
app.set('views', './demo');
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', (req, res, next) => {
  res.render('index.html');
});

app.get('/error', (req, res, next) => {
  res.send({
    message: 1
  });
});

app.listen(3344);
console.log(`listening port 3344`);

module.exports = app;
