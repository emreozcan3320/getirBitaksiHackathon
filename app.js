var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config/database');
var records = require('./models/record');


var app = express();

//port configuration for heroku and local
app.set('port', (process.env.PORT || 5000));

// Body Parser Middleware
app.use(bodyParser.json());

//mongoose promises
mongoose.Promise = global.Promise;
// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', function() {
    console.log('Connected to database ' + config.database);
});

// On Error
mongoose.connection.on('error', function(err) {
    console.log('Database error: ' + err);
});

//for testing
app.get('/', function(req, res) {
    records.find({})
        .then(function(record) {
            var copyRecord = record;
            var sonuc = [];
            for (var a = 0; a < copyRecord.length; a++) {
                var date = new Date(copyRecord[a].createdAt);
                var newData = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
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
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
