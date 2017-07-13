"use strict";

const request = require('request');
const logger = require('services/loggerService');

const apiUrls = [{
    regex: new RegExp(/^\/?madrox/),
    baseUrl: process.env.BASE_URL_MADROX || process.env.API_BASE_URL
}];

module.exports.get = function(options, data, req, res) {
    return _requestAPI('get', options, data, req, res);
};

module.exports.post = function(options, data, req, res) {
    return _requestAPI('post', options, data, req, res);
};

var _requestAPI = function(method, options, data, req, res) {
    if (options.mock && options.mockUrl) {
        let mockRes = require('mocks/' + options.mockUrl);
        logger.info('Mock API ::', options.mockUrl);
        return new Promise(resolve => resolve(mockRes));
    }

    let params = _initParams(method, options, data, req);
    return new Promise((resolve, reject) => {
        logger.debug('Params: ', JSON.stringify(params));
        var initTime = new Date().getTime();
        request(params, function(error, response, body) {
            let url = params.baseUrl + params.url;
            logger.info('API ::', url, new Date().getTime() - initTime, 'ms');
            if (error) {
                logger.error('ERROR IN API', url, '::', error);
                return reject({ url, error });
            }
            if (response.statusCode !== 200) {
                logger.error('ERROR IN API', url, ':: StatusCode', response.statusCode, '::', body);
                return reject({ url, statusCode: response.statusCode, body });
            } else if (body && typeof body.statusCode !== "undefined" && !(body.statusCode === '2XX' || body.statusCode === 200)) {
                logger.error('ERROR IN API', url, ':: StatusCode', body.statusCode, '::', body);
                return reject({ url, statusCode: body.statusCode, body });
            }
            if (res) {
                _setResponseHeaders(res, response);
            }
            return resolve(body);
        });
    });
};

var _initParams = function(method, options, data, req) {
    var params = {
        method: method,
        baseUrl: _getBaseUrl(options.url, options.baseUrl),
        url: options.url,
        json: true
    };

    if (data) {
        if (options.dataAttribute) {
            params[options.dataAttribute] = data;
        } else if (method == 'get') {
            params.qs = data;
        } else {
            params.body = data;
        }
    }

    if (req && req.headers) {
        params.headers = _getHeaders(options, req);
    }
    return params;
};

var _getBaseUrl = function(url, baseUrl) {
    if (baseUrl) {
        return baseUrl;
    } else {
        var filteredAPITypes = apiUrls.filter(function(apiType) {
            return url.match(apiType.regex);
        });
        if (filteredAPITypes.length) {
            return filteredAPITypes[0].baseUrl;
        }
        return process.env.API_BASE_URL;
    }
};

var _getHeaders = function(options, req) {
    let headers = req.headers;
    let reqHeaders = {};

    if (headers['cookie']) {
        reqHeaders['Cookie'] = headers['cookie'];
    }
    reqHeaders['User-Agent'] = headers['user-agent'];
    reqHeaders['referer'] = headers['referer'];
    if (headers['content-type']) {
        reqHeaders['Content-Type'] = headers['content-type'];
    }

    if (headers['X-host']) {
        reqHeaders['X-host'] = headers['X-host'];
    } else if (process.env.NODE_ENV !== 'DEV') {
        reqHeaders['X-host'] = process.env.HOST;
    }

    if (!options.noClientIP) {
        reqHeaders['Client-IP'] = _getIP(req);
    }
    reqHeaders['Accept-Encoding'] = 0;
    return reqHeaders;
};

var _getIP = function(req) {
    var ip;
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    }
    return ip;
};

var _setResponseHeaders = function(res, apiResponse) {
    if (res) { //write cookie and other header values to response
        if (apiResponse.headers['set-cookie']) {
            res.setHeader('Set-Cookie', apiResponse['headers']['set-cookie']);
        }
        if (apiResponse.headers['content-encoding']) {
            res.setHeader('Content-Encoding', apiResponse.headers['content-encoding']);
        }
    }
};