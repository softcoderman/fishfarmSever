var express = require('express');
//var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken');
var config = require('../config.json');
var TOKEN_SECRET = config.token.secret;
var TOKEN_EXPIRES = 
parseInt(config.token.expiresInSeconds, 10);

var User = require('../models/user');

var router = express.Router();

router.post('/signup', function(request, response) {

  console.log(request.body);

  // find the user
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

    if (user) {
      response.status(409).json({
        success: false,
        message: 'User with the username \'' + request.body.username + '\' already exists.'
      });

      return;
    }

 /*   bcrypt.genSalt(10, function (error, salt) {

      if (error) {
        response.status(500).json({
          success: false,
          message: 'Internal server error'
        });

        throw error;
      }

      bcrypt.hash(request.body.password, salt,
       function (error, hash) {

        if (error) {
          response.status(500).json({
            success: false,
            message: 'Internal server error'
          });

          throw error;
        }*/

        var user = new User({

          username:  request.body.username,
          email:     request.body.email,
          password:  request.body.password,
          phone:     request.body.phone,
          admin:     request.body.admin,  
          fullname:  request.body.fullname     
        });

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
            user: user
          });
        });
      });
  });
 

router.post('/signin',function (request, response) {
   console.log(request.body);

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
        response.status(401).json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
      return;
    }  
   
     if(user.password != request.body.password){
       response.status(401).json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
       return;
    }
    else{
       var token = jsonwebtoken.sign({
           username: user.username }, TOKEN_SECRET, {
        expiresIn: TOKEN_EXPIRES
      });
        response.json({
          success: true,
          token: token
          });
    }     
      
    
  });
});



   

  /*  bcrypt.compare(request.body.password,
     user.password, function (error, result) {

      if (error) {
        response.status(500).json({
          success: false,
          message: 'Internal server error'
        });

        throw error;
      }

      if (! result) {

        response.status(401).json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });

        return;
      }

      // if user is found and password is right
      // create a token
      var token = jsonwebtoken.sign({ username: user.username }, TOKEN_SECRET, {
        expiresIn: TOKEN_EXPIRES
      });
      
      response.json({
        success: true,
        token: token
      });

    });
  });
});*/


router.get('/:userID',function (req, res) {  
    User.find({id:req.params.userID})
    .populate('sensorDatas').exec()
    .then(function(resultData){})   
       
    });          



module.exports = router;