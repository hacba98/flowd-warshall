const path = require('path');
const express = require('express');
const app = express();

// static resources
app.use(express.static(path.join(__dirname, 'charts')));


// default api
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'charts/index.html'));
})


// start web server
app.listen(3000, () => {
  console.log('Server is listening port 3000 ...');
});