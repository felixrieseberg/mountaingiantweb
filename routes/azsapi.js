// Exports
/* ------------------------------------------------------------------------------------- */
module.exports = function (app) {

    // Creating coupon manager and connection to MongoLab
    var azsapi_mongolab_url = "mongodb://mg-mongo:80cdiMjOb7Wxk7EWEIaFPWsO_couhJcPDyCN8b0VFzE-@ds027758.mongolab.com:27758/mg-mongo";
    var base = "/api/azs/1/";

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    // Connect
    mongoose.connect(azsapi_mongolab_url);

    var couponSchema = new Schema({
        identifier: String,
        value: Number,
        used: Boolean
    });

    couponSchema.statics.findById = function (searchId, cb) {
        this.find({ identifier: searchId }, cb);
    }

    var Coupon = mongoose.model('Coupon', couponSchema);


    // version
    app.get(base + 'version', function (req, res) {
        res.send({ version: '1014' })
    });

    // additional credits
    app.get(base + 'coupon/find/:couponId', function (req, res) {

    });

    // Parameters: 
    app.get(base + 'coupon/create/', function (req, res) {
        var identifier = req.query.identifier;
        var value = req.query.value;

        if (identifier && value) {
            new Coupon({
                identifier: identifier,
                value: value
            });

            console.log("New coupon created. Id: " + identifier + " Value:" + value);
        }
    });
}