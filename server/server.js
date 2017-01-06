const express= require('express');

const app = express();
const path = require('path');
const port = process.env.PORT || 4040;

// Path to built content folder
const content_path = path.join(__dirname, './../build');

app.get('/', (req, res) => {
  res.header('Cache-Control', "max-age=60, must-revalidate, private");
  res.sendFile('index.html', {
    root: content_path
  });
});

const server = app.listen(port,() => {
  console.log('App listening at http://%s:%s', server.address().address, server.address().port);
});
