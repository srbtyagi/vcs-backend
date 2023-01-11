const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const db = require('../db/db');



// var redis = require('redis');
// var JWTR =  require('jwt-redis').default;
// var redisClient = redis.createClient();
// var jwtr = new JWTR(redisClient);
// const express=require('express');
// const app=express();
// const db=require('../db/db');



module.exports = function (app) {

    // app.get('/api',function(req,res){
    // res.json({
    // message:'welcome to the api'
    // });
    // });


    app.post('/vcsapi/get_token', function (req, res) {
        const user = {
            email: req.body.email,
            password: req.body.password
        }
        const options = {
            issuer: "34.201.117.204",
            audience: req.body.email
        }

        ///////////////jwt sign in
        jwt.sign({
            user
        }, 'secretkeys', options, function (err, token) {
            if (!err) {
                res.json({
                    token: token
                });
            } else {
                res.json(err);
            }
        });
        /////////////////////



    });



}






module.exports.verifyToken = function verifyToken(req, res, next) {
    //// // //console.log("A");
    //get auth header value
    const bearerHeader = req.headers['authorization'];


    //check if berear is undefined
    if (typeof bearerHeader !== 'undefined') {
        //split at the space
        const bearer = bearerHeader.split(' ');

        //get token from array
        const bearerToken = bearer[1];

        //set the token
        req.token = bearerToken;

        //next middleware
        next();

    } else {
        res.sendStatus(403);
    }

}

module.exports.verify = function verify(req, res, next) {


    jwt.verify(req.token, 'secretkeys', function (err, authData) {
        if (err) {
            // // // //console.log('eeee');

            verifys = "not verify";
            next();

        } else {
            verifys = "verify";
            next();
        }
    });


}