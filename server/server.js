const express = require('express');
const compression = require('compression');

const app = express();
const path = require('path');
const port = process.env.PORT || 4040;

const content_path = path.join(__dirname, './../build');

app.enable('trust proxy');
app.use(compression());

app.get('/', (req, res) => {
  res.header('Cache-Control', "max-age=60, must-revalidate, private");
  res.sendFile('index.html', {
    root: content_path
  });
});

app.use('/', express.static(content_path, {
    maxage: 31557600
}));

const server = app.listen(port,() => {
  console.log('App listening at http://%s:%s', server.address().address, server.address().port);
});
