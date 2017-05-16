var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var SensorDataschema = new Schema({
  id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
 
  temprature: {
    type: Number,
    required: true
  },
  PH: {
    type: Number,
    required: true
  },

   oxygen: {
    type: Number,
    required: true
  },

feeding: {
    type: String,
    required: true
  },

  conductivity: {
    type: String    
  },  

  describition: {
    type: String    
  },  

  pond:{
     type: Schema.Types.ObjectId,
     ref: 'Pond',
     required: true
  },
  
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
SensorDataschema.pre('save', function (next) {
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

module.exports = mongoose.model('SensorData', SensorDataschema,
   'sensorDatas');
