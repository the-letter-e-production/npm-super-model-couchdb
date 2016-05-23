var Promise = require('bluebird');
var request = require('request');

/**
 * Define SuperModel Data Source - CouchDB
 */
var SuperModelCouchdb = function(options){
    return {
        name: 'couchdb',
        source: {
            find: function(id, cb){
                return Promise.promisify(getDocument, {context: this})(id).then(function(data){
                    this.import(data);
                    if( typeof cb == 'function' ){
                        cb.call(this);
                    }
                    return;
                }.bind(this), function(err){
                    cb.call(this, err);
                    throw new Error(err);
                }.bind(this)).bind(this);
            },
            save: function(cb){
                return Promise.promisify(saveDocument, {context: this})().then(function(body){
                    this.set('_id', body.id);
                    this.set('_rev', body.rev);
                    if( typeof cb == 'function' ){
                        cb.call(this);
                    }
                    return;
                }.bind(this), function(err){
                    cb.call(this, err);
                    throw new Error(err);
                }.bind(this)).bind(this);
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
            return cb('Request Error: ' + err);
        }
        return cb(null, body);
    });
}

function saveDocument(cb){
    request({
        method: 'PUT',
        url: this._options.protocol + '://' + this._options.host + ':' + this._options.port + '/' + this._options.database + (this.get('_id') ? '/' + this.get('_id') : ''),
        json: this.export()
    }, function(err, res, body){
        if( err ){
            return cb('Request Error: ' + err);
        }
        if( body.ok === true ){
            cb(null, body);
        }else{
            return cb('CouchDB ' + body.error + ': ' + body.reason);
        }
    }.bind(this));
}

module.exports = SuperModelCouchdb;
