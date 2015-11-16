var gcloud = require("gcloud"),
    async = require("async"),
    util = require("util");

module.exports = Dataset;

function padding(value) {
    return ("0000" + value).slice(-2);
};

function Dataset(options) {
    options = options || {};

    this.verifyRequieredOptions(options);

    this.bigQuery = gcloud.bigquery({
        projectId: options.projectId,
        auth: options.auth
    });

    this.bqDataset = this.bigQuery.dataset(options.datasetId);
    this.datasetId = options.datasetId;

    this.ds = this.bigQuery.dataset(this.datasetId);
}

Dataset.MissingOption = function(missing) {
    this.message = "Missing options: " + missing.join(", ");
};

Dataset.prototype.create = function(callback) {
    this.bigQuery.createDataset(this.datasetId, callback);
};

Dataset.prototype.ensure = function(callback) {
    var self = this;

    async.waterfall([
        // verify existence
        function (fn) {
            self.bigQuery.getDatasets(fn);
        },

        // create table
        function (datasets, fn) {

            datasets = datasets.filter(function(d) {
                return d.id === self.datasetId;
            });

            if ( datasets.length !== 0) {
                fn(null, datasets[0]);
                return;
            }

            self.create(fn);
        }
    ], callback);
};

Dataset.prototype.currentTable = function(prefix) {
    var today = new Date();
    return this.tableName(prefix, today);
};

Dataset.prototype.tableName = function(prefix, date) {
    return util.format(
        "%s%s%s%s",
        prefix,
        date.getFullYear(), padding(date.getMonth() + 1), padding(date.getDate())
    );
};

Dataset.prototype.ensureTables = function(prefix, schema, callback) {
    var self = this,
        today = new Date(),
        tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        dates = [ today, tomorrow ];

    var tableNames = dates.map(function(d) {
        return self.tableName(prefix, d);
    });

    function create(tableName, fn) {
        self.ds.createTable({ "id": tableName, "schema" : schema}, fn);
    };

    async.waterfall([
        // get tables that already exist
        function(fn) {
            self.ds.getTables(fn);
        },

        function(tablesOnDataset, fn) {
            tablesOnDataset = tablesOnDataset.map(function(t) {
                return t.id.split(".")[1];
            });

            // Filter tables that doesn't exist
            tableNames = tableNames.filter(function(tableName) {
                return tablesOnDataset.indexOf(tableName) === -1;
            });

            async.each(tableNames, create, fn);
        }

    ], callback);
};

Dataset.prototype.verifyRequieredOptions = function(options) {
    var required = [ "projectId", "datasetId", "auth"];

    var missing = required.filter( function(k) {
        return Object.keys(options).indexOf(k) === -1;
    });

    if ( missing.length ) {
        throw new Dataset.MissingOption(missing);
    };
};
