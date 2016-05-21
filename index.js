var q = require('q');
var request = require('request');

/**
 * Define SuperModel Data Source - CouchDB
 */
var SuperModelCouchdb = function(options){
    return {
        name: 'couchdb',
        source: {
            find: function(id, cb){
                var _this = this;
                request({
                    method: 'GET',
                    url: this.data_sources.couchdb._options.protocol + '://' + this.data_sources.couchdb._options.host + ':' + this.data_sources.couchdb._options.port + '/' + this.data_sources.couchdb._options.database + '/' + id
                }, function(err, res, body){
                    if( err ){
                        throw new Error('Request Error: ' + err);
                    }

                    var data = JSON.parse(body);
                    var imports = {};
                    for(var key in data){
                        if( key.match(/^_/) ){
                            _this[key] = data[key]; 
                        }else{
                            imports[key] = data[key];
                        }
                    }
                    _this.import(imports);
                    cb(_this);
                });
            },
            _options: options
        }
    };
};

module.exports = SuperModelCouchdb;
