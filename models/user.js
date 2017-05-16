var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var UserSchema = new Schema({
  id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  fullname: {
    type: String,
    required: true
  }, 
  email:{
    type: String,
    required: true,
    unique: true
   },

  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  phone:{
    type:String,     
    required:true
  },
  admin:{
    type:Boolean,
    required:true
  },


  ponds: [{
    type: Schema.Types.ObjectId,
    ref: 'Pond'
  }],
  sensorDatas: [{
    type: Schema.Types.ObjectId,
    ref: 'SensorData'
  }],

  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
});

// on every save, add the date
UserSchema.pre('save', function (next) {
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

module.exports = mongoose.model('User', UserSchema, 'users');
