var express = require('express');
var tokenMiddleware = require('../middleware/token');

var User = require('../models/user');
var Pond = require('../models/pond');

var router = express.Router();

router.post('/', 
      tokenMiddleware.verifyToken, 
function(request, response) {

  console.log(request.body);

   console.log("==========================================");

  // find the user
  User.findOne(
      {
        username: request.body.username
     },function(error, user) {
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

    console.log(user);
    var pond = new Pond({
      pondname: request.body.pondname,
      longitude: request.body.longitude,
      latitude:  request.body.latitude,
      createdBy: user._id      
    });

    pond.save(function (error) {
      if (error) {
        response.status(500).json({
          success: false,
          message: 'Internal server error'
        });
          console.log("this is the error found");
          return;
        }

     user.ponds.push(pond);
     user.save(function (error) {
        if (error) {
          response.status(500).json({
            success: false,
            message: 'Internal server error'
          });
          return;          
        }        
         response.json({
          success: true,
          pond: pond
        });
     }) ;         
    });
  });  //end of findOne  
}); //end of this route

router.get("/",
function(request,response){
  Pond.find({}, function(error, data){
       
      if (error) {
          response.status(500).json({
            success: false,
            message: 'Internal server error'
          });
          return;          
        }    

    
    response.json({
          success: true,
          ponds: data
        });
  });
    
});

router.get('/:pondID', 
           function(request, response) {               
  console.log(request.params);
  Pond
  .findOne({
    id: request.params.pondID
  }) 
  .exec(function handleQuery(error, pond) {

    if (error) {
      response.status(500).json({
        success: false,
        message: 'Internal server error'
      });

      throw error;
    }

    if (! pond) {
      response.status(404).json({
        success: false,
        message: "Can't find pond with id " + request.params.eventId + "."
      });

      return;
    }

    response.json({
      success: true,
      pond: pond
    });
  });
});


module.exports = router;