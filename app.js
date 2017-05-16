var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

var CONFIG = require('./config.json');
var PORT = parseInt(CONFIG.server.port, 10);
var HOST_NAME = CONFIG.server.hostName;
var DATABASE_NAME = CONFIG.database.name;

var tokenMiddleware = require('./middleware/token');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


mongoose.connect('mongodb://127.0.0.1:27017/FishFarm');
console.log("connected to db FishFarm");

var usersRoutes = require('./routes/users');

app.use('/api/users', usersRoutes);

var pondsRoutes = require('./routes/ponds');

app.use('/api/ponds', pondsRoutes);

var sensordataRoutes = require('./routes/sensorDatas');

app.use('/api/sensorData', sensordataRoutes);


var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});