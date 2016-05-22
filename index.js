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
    request({
        method: 'GET',
        url: this._options.protocol + '://' + this._options.host + ':' + this._options.port + '/' + this._options.database + '/' + id,
        json: true
    }, function(err, res, body){
        if( err ){
            throw new Error('Request Error: ' + err);
        }
        cb.call(this, body);
    }.bind(this));
}

function saveDocument(cb){
    request({
        method: 'PUT',
        url: this._options.protocol + '://' + this._options.host + ':' + this._options.port + '/' + this._options.database + (this.get('_id') ? '/' + this.get('_id') : ''),
        json: this.export()
    }, function(err, res, body){
        if( err ){
            throw new Error('Request Error: ' + err);
        }
        
        if( body.ok === true ){
            this.set('_id', body.id);
            this.set('_rev', body.rev);
            cb.call(this);
        }else{
            throw new Error('CouchDB ' + body.error + ': ' + body.reason);
        }
    }.bind(this));
}

module.exports = SuperModelCouchdb;
