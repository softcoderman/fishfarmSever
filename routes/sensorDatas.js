var express = require('express');
var tokenMiddleware = require('../middleware/token');

var User = require('../models/user');
var Pond = require('../models/pond');
var SensorData = require('../models/sensorData');
var router = express.Router();


router.post('/',
       tokenMiddleware.verifyToken,
function(request, response) {

console.log("==========================================");

  console.log(request.body);

  console.log("==========================================");


  User.findOne({
    username: request.body.username
  }, function(error, user) { 
    if (error) {
      response.status(500).json({
        success: false,
        message: 'Internal server error'
      });
      return;
    } 

    if (!user) {
      response.status(404).json({
        success: false,
        message: "Can't find user with username " + request.body.username + "."
      });
      return;
    }
    console.log("==========================================");
    console.log(user);

    console.log("===================================");

    Pond.findOne({
      id: request.body.pondID
    }, function(error, pond) {

      if (error) {
        response.status(500).json({
          success: false,
          message: 'Internal server error'
        });
        return;
      }

      if (!pond) {
        response.status(404).json({
          success: false,
          message: "Can't find pond with id " + request.body.pondID + "."
        });
        return;
      }
      
      var sensorData = new SensorData({
        pond: pond._id,
        temprature: request.body.temprature,
        PH: request.body.PH,
        oxygen: request.body.oxygen,
        feeding: request.body.feeding,
        conductivity: request.body.conductivity,
        describition: request.body.describition,
        createdBy: user._id
      });
       sensorData.save(function (error) {
        if (error) {
          response.status(500).json({
            success: false,
            message: 'Internal server error'
          });
          return;
        }
       pond.sensorDatas.push(sensorData);
        pond.save(function (error) {
          if (error) {
            response.status(500).json({
              success: false,
              message: 'Internal server error'
            });
            throw error;
          }
          user.sensorDatas.push(sensorData);

          user.save(function (error) {

            if (error) {
              response.status(500).json({
                success: false,
                message: 'Internal server error'
              });

              throw error;
            }

            response.json({
              success: true,
              sensorData: sensorData
            });
          });

       });    
       });         
   });// end find pond
  });  //end of findOne
});//end of post sensorData



router.get('/', tokenMiddleware.verifyToken,
 function(request, response) {
   SensorData.find({})
   .populate('createdBy')
   .populate('pond')
   .exec(function(error,sensorData){
      if (error) {
      response.status(500).json({
        success: false,
        message: 'Internal server error'
       });
       throw error; 
      }
      if (!sensorData) {
       response.status(404).json({
        success: false,
        message: "Can't find sensorData with id " + 
        request.params.sensorDataID + "."
      });
      return;
    }

  /*  var usernameFromToken = 
       tokenMiddleware.getUsernameFromToken(request);

    if (usernameFromToken !== sensorData.createdBy.username) { 
      response.status(404).json({
        success: false,
        message: "Can't find sensorData with id " + request.params.ticketId + "."
      });
      return;
    }*/

    response.json({
      success: true,
      sensorDataInfos: sensorData
    });
   });

});


router.get('/:sensorDataID', tokenMiddleware.verifyToken,
 function(request, response) {
   var myRequestID;
   if(request.params.sensorDataID){
       myRequestID = request.params.sensorDataID;
   }
   console.log(myRequestID);
   SensorData.findOne({
    id: myRequestID
  })
  .populate('createdBy')
  .populate('pond')
  .exec(function(error,sensorData){
      if (error) {
      response.status(500).json({
        success: false,
        message: 'Internal server error'
      });
      throw error; 
    }
      if (!sensorData) {
       response.status(404).json({
        success: false,
        message: "Can't find sensorData with id " + 
        request.params.sensorDataID + "."
      });
      return;
    }

    var usernameFromToken = 
       tokenMiddleware.getUsernameFromToken(request);

    if (usernameFromToken !== sensorData.createdBy.username) { 
      response.status(404).json({
        success: false,
        message: "Can't find sensorData with id " + request.params.ticketId + "."
      });
      return;
    }

    response.json({
      success: true,
      sensorData: sensorData
    });

  });

});

 
module.exports = router;