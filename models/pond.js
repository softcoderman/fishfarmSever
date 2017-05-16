var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var Pondschema = new Schema({
  id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  pondname: {
    type: String,
    unique: true,
    required: true   
  },
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },

  sensorDatas: [{
    type: Schema.Types.ObjectId,
    ref: 'SensorData'
  }],
  
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
});

// on every save, add the date
Pondschema.pre('save', function (next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updatedAt = currentDate;

  // if created_at doesn't exist, add to that field
  if (! this.createdAt) {
    this.createdAt = currentDate;
  }

  next();
});

module.exports = mongoose.model('Pond', Pondschema, 'ponds');
