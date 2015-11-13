var fs = require("fs"),
    async = require("async"),
    nockBack = require("nock").back,
    Support = require("./support");

var Dataset = require("../lib");

var projectId = "i-amat";

nockBack.fixtures = __dirname + '/nockFixtures';
nockBack.setMode('record');

var before = function(scope) {
    scope.filteringRequestBody = function(body, aRecordedBody) {
        if (typeof(body) !== 'string' || typeof(aRecordedBody) !== 'string') {
            return body;
        }

        var recordedBodyResult = /timestamp:([0-9]+)/.exec(aRecodedBody);
        if (!recodedBodyResult) {
            return body;
        }

        var recordedTimestamp = recodedBodyResult[1];
        return body.replace(/(timestamp):([0-9]+)/g, function(match, key, value) {
            return key + ':' + recordedTimestamp;
        });
    };
};


describe("exoDataset", function() {
    var auth = fs.readFileSync("./keys/jsonkey.json");

    describe("creation", function() {
        it("should create dataset remotely", function(done) {
            nockBack("createDatasteRemotely.json", function(nockDone) {
                var ds = new Dataset({
                    "projectId": projectId,
                    "datasetId": "dataset_creation",
                    "auth": auth
                });

                ds.create(function(err) {
                    nockDone();
                    done(err);
                });

            });
        });
    });

    describe("ensure", function() {
        describe("dataset doesn't exist", function() {
            it("shouldn't return error altough dataset doesn't exists", function(done) {
                nockBack("ensureDatasetWhenDatasetDoesntExist.json", function(nockDone) {
                    var ds = new Dataset({
                        "projectId": projectId,
                        "datasetId": "ensure_dataset_creation",
                        "auth": auth
                    });

                    ds.ensure(function(err) {
                        nockDone();
                        done(err);
                    });
                });
            });
        });
        describe("dataset already exist", function() {
            it("shouldn't return error altough dataset exists", function(done) {
                nockBack("ensureDatasetWhenDatasetDoesntExist.json", function(nockDone) {
                    var ds = new Dataset({
                        "projectId": projectId,
                        "datasetId": "ensure_dataset_creation",
                        "auth": auth
                    });

                    ds.ensure(function(err) {
                        nockDone();
                        done(err);
                    });
                });
            });
        });
    })
    ;

    describe("table creation", function() {
        var ds = new Dataset({
                "projectId": projectId,
                "datasetId": "exo_tablecreation_testing",
                "auth": auth
            });

        it("should create a new table inside the dataset", function(done) {
            nockBack("tableCreationOnDataset.json", function(nockDone) {
                async.series([
                    // ensure dataset
                    function(fn) {
                        ds.ensure(fn);
                    },

                    // ensure tables
                    function(fn) {
                        ds.ensureTables("prefix_", [
                            { "name": "atcode", "type": "STRING", "mode": "REQUIRED" }
                        ], fn);

                    }
                ], function(err, createdTables) {
                    nockDone();
                    done(err);
                });
            });
        });
    })
    ;
});
