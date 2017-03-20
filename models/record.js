var mongoose = require('mongoose');
var config = require('../config/database');

var RecordSchema = mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    value: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var record = module.exports = mongoose.model('record', RecordSchema);
