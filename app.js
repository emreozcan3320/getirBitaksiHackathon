var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config/database');
var records = require('./models/record');


var app = express();
var port = process.env.PORT || 3000;

// Body Parser Middleware
app.use(bodyParser.json());

//mongoose promises
mongoose.Promise = global.Promise;

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', function() {
    console.log('Connected to database' + config.database);
});

// On Error
mongoose.connection.on('error', function(err) {
    console.log('Database error: ' + err);
});

//redirect to /getRecord
app.get('/', function(req, res) {
    res.send("Lütfen get requesti için /getRecord uzantısını (endpoint'ini) kullanın !");
});
//for testing
app.get('/getRecord', function(req, res) {
    records.find({})
        .then(function(record) {
            var copyRecord = record;
            var sonuc = [];
            for (var a = 0; a < copyRecord.length; a++) {
                var date = new Date(copyRecord[a].createdAt);
                var year = date.getFullYear();
                var month;
                if((date.getMonth() + 1)<10){
                   month = "0"+(date.getMonth() + 1);
                }else{
                   month = (date.getMonth() + 1);
                }
                var day = date.getDate();
                var newData = year + "-" + month + "-" + day;
                var obj = {
                    key: copyRecord[a].key,
                    value: copyRecord[a]._id,
                    createdAt: newData
                };
                sonuc.push(obj);
            }
            res.json(sonuc);
        })
        .catch(function(err) {
            console.log(err);
        });
});

//post request to getRecords
app.post('/getRecord', function(req, res) {
    var newRecord = new records({
        key: req.body.key
    });

    records.create(newRecord).then(function(record) {
            res.json({
                success: true,
                msg: 'registered'
            });
        })
        .catch(function(err) {
            res.json({
                success: false,
                msg: 'Failed to register '
            });
        });

});


//server listen
app.listen(port, function() {
    console.log("server is runing at port" + port);
});
