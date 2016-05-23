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
                getDocument.call(this, id, function(data){
                    this.import(data);
                    cb.call(this);
                });
            },
            save: function(cb){
                saveDocument.call(this, function(){
                    cb.call(this);
                });
            },
            _options: options
        }
    };
};

function getDocument(id, cb){
    var _this = this;
    request({
        method: 'GET',
        url: this.data_sources.couchdb._options.protocol + '://' + this.data_sources.couchdb._options.host + ':' + this.data_sources.couchdb._options.port + '/' + this.data_sources.couchdb._options.database + '/' + id
    }, function(err, res, body){
        if( err ){
            throw new Error('Request Error: ' + err);
        }
        var data = JSON.parse(body);
        cb.call(_this, data);
    });
}

function saveDocument(cb){
    var _this = this;
    request({
        method: 'PUT',
        url: this.data_sources.couchdb._options.protocol + '://' + this.data_sources.couchdb._options.host + ':' + this.data_sources.couchdb._options.port + '/' + this.data_sources.couchdb._options.database + (this.get('_id') ? '/' + this.get('_id') : ''),
        json: this.export()
    }, function(err, res, body){
        if( err ){
            throw new Error('Request Error: ' + err);
        }

        var data = body;
        if( data.ok === true ){
            _this.set('_id', data.id);
            _this.set('_rev', data.rev);
            cb.call(_this);
        }else{
            throw new Error('CouchDB ' + data.error + ': ' + data.reason);
        }
    });
}

module.exports = SuperModelCouchdb;
