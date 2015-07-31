/*
 * node-ymlp: Node client for YourMailingListProvider emailing service
 *
 * (C) 2015 Nicolas Nunge & the Contributors
 * http://www.nikkow.eu/node-ymlp/
 * GNU/GPL Licence
 */

var _ = require("underscore");
var qs = require("querystring");
var request = require("request");

// - Default error texts for API related errors
var texts = {
    "err_100": "The API key and/or username is wrong",
    "err_101": "The API is disabled.",
    "err_102": "This IP address is not allowed to use the API."
};

// - Constructor
function Ymlp(api_key, username, options) {
    "use strict";

    if(!api_key || !username) {
        throw new Error("API key and username are required.");
    }

    options = options || {};
    this.api_endpoint = "www.ymlp.com/api/";
    this.api_key = api_key;
    this.username = username;
    this.output = /*options.output ||*/ "json";
    this.secure = options.secure || "true";

    this.pathBuilder = function pathBuilder (request, params) {
        var path = '';
        params = params || {};

        path += this.secure ? "https://" : "http://";
        path += this.api_endpoint;
        path += request;
        path += '?';
        path += qs.encode(_.extend({
            "Key": this.api_key,
            "Username": this.username,
            "Output": this.output
        }, params));

        return path;
    };

    this.requestBuilder = function requestBuilder (group, action, params, callback) {
        var fullAction;

        if (_.isFunction(params)) {
            callback = params;
            fullAction = group;
            params = action;
        } else {
            fullAction = group +"."+ action;
        }

        request({
            "url": this.pathBuilder(fullAction, params),
            "json": true
        }, function (error, response, body) {
            if(_.isNull(body)) {
                callback(null, []);
            } else if (!error && response.statusCode == 200) {
                if(body.Code) {
                    switch(parseInt(body.Code)) {
                        case 0:     callback(null, body.Output); break;
                        case 100:   callback(new Error(texts.err_100), false); break;
                        case 101:   callback(new Error(texts.err_101), false); break;
                        case 102:   callback(new Error(texts.err_102), false); break;
                        default:    callback(new Error(body.Output), false); break;
                    }
                } else {
                    callback(null, body);
                }
            } else {
                callback(new Error("Connectivity/HTTP Error"), false);
            }
        });
    };
}

Ymlp.prototype.ping = function(callback) {
    this.requestBuilder("Ping", {}, callback);
};

Ymlp.prototype.contacts = function(method, options, callback) {
    if(_.isFunction(options)) {
        callback = options;
        options = {};
    }

    this.requestBuilder("Contacts", method, options, callback);
};

Ymlp.prototype.groups = function(method, options, callback) {
    if(_.isFunction(options)) {
        callback = options;
        options = {};
    }

    this.requestBuilder("Groups", method, options, callback);
};

Ymlp.prototype.fields = function(method, options, callback) {
    if(_.isFunction(options)) {
        callback = options;
        options = {};
    }

    this.requestBuilder("Fields", method, options, callback);
};

Ymlp.prototype.filters = function(method, options, callback) {
    if(_.isFunction(options)) {
        callback = options;
        options = {};
    }

    this.requestBuilder("Filters", method, options, callback);
};

Ymlp.prototype.newsletter = function(method, options, callback) {
    if(_.isFunction(options)) {
        callback = options;
        options = {};
    }

    this.requestBuilder("Newsletter", method, options, callback);
};

Ymlp.prototype.archive = function(method, options, callback) {
    if(_.isFunction(options)) {
        callback = options;
        options = {};
    }

    this.requestBuilder("Archive", method, options, callback);
};

module.exports = Ymlp;
