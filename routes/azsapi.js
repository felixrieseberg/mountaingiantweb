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
        used: { type: Boolean, default: false}
    });

    couponSchema.statics.findById = function (searchId, cb) {
        this.find({ identifier: searchId }, cb);
    }

    var Coupon = mongoose.model('Coupon', couponSchema);


    // version
    app.get(base + 'version', function (req, res) {
        res.send({ version: '1014' })
    });

    // ----------------------------------------------------------------------------------------
    // Credits API
    // ----------------------------------------------------------------------------------------
    
    // Finding Coupon
    app.get(base + 'coupon/find/:identifier', function (req, res) {

        var identifier = req.params.identifier;
        var value;
        var used;

        console.log("Init: Trying to find coupon");

        if (identifier) {
            Coupon.find({ identifier: identifier}, function (error, result) {
                if (error) {
                    console.log("Coupon couldn't be found, error: " + error);
                    res.send({ error: "Coupon couldn't be found." });
                } else {
                    console.log(result);
                    res.send(result);
                }
            })
        } else {
            console.log("Provided parameters insufficient. Provided: " + req.params.couponId);
            res.send({ error: "Provided parameters insufficient." });
        }

    });

    // Cashing in coupon (marking as 'used')
    app.get(base + 'coupon/consume/:identifier', function (req, res) {

        var identifier = req.params.identifier;
        var value;
        var used;

        console.log("Init: Trying to find coupon");

        if (identifier) {
            Coupon.find({ identifier: identifier}, function (error, result) {
                if (error) {
                    console.log("Coupon couldn't be found, error: " + error);
                    res.send({ error: "Coupon couldn't be found." });
                } else {
                    console.log(result);
                    Coupon.update(
                        { identifier: identifier },
                        { $set: { used: true }},
                        function (error, numberAffected, raw) {
                            if (error) {
                                console.log("Coupon could not be updated");
                                res.send({ error: "Coupon could not be updated"});
                            } else {
                                console.log("Update successfull. MongoDB items updated: " + numberAffected);
                                console.log("Raw response was: " + raw);
                                res.send({ success: "Coupon " + identifier + " consumed"});
                            }
                        }
                    )
                }
            })
        } else {
            console.log("Provided parameters insufficient. Provided: " + req.params.couponId);
            res.send({ error: "Provided parameters insufficient." });
        }

    });

    // Creating Coupon
    app.get(base + 'coupon/create/:identifier/:value', function (req, res) {
        console.log("Init: Coupon create");

        var identifier = req.params.identifier;
        var value = req.params.value;

        if (identifier && value) {
            var createdCoupon = new Coupon({
                identifier: identifier,
                value: value
            });

            console.log("New coupon created. Id: " + identifier + " Value:" + value);
            console.log("Trying to save new coupon to MongoDB.");

            createdCoupon.save(function (error, createdCoupon) {
                if (error) {
                    console.log("We encountered an error: " + error)
                } else {
                    console.log("Save without error");
                    res.send({ success: "Coupon created" });
                }
            });

        } else {
            res.send({ error: "Provided parameters insufficient." });
        }
    });
}