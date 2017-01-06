import express from 'express';

const app = express();
const port = process.env.PORT || 4040;

app.get('/', (req, res) => {
  res.send('Virtual Reality is the future');
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
