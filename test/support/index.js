var gcloud = require("gcloud"),
    async = require("async");

var public = {};
module.exports = exports = public;

/***
* @params {Object} options:
*    - projectId
*    -  auth
* @params {Function} callback
*
*/
public.cleanUp = function(options, callback) {
    var bigQuery = gcloud.bigquery(options);

    bigQuery.getDatasets( function(err, result) {
        if ( err ) {
            callback(err);
            return;
        }

        var datasets = result.map(function(e) {
            return bigQuery.dataset(e.id);
        });

        async.each( datasets, function(d, fn) {
            d.delete({force: true}, fn);
        }, callback);
    });
};
