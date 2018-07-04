let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('../models/user');

let skema = new Schema({
    user : {type: Schema.Types.ObjectId, ref: 'User'},
    cart : {type: Object, required: true},
    // address : {type: String, required: true },
    nama : {type: String, required: true},
    paymentId : {type: String, required: true}
});

let Order = module.exports = mongoose.model('Order', skema);