"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*** angular ***/
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
var app_cookie_1 = require("./app.cookie");
/*** models ***/
// Import RxJs required methods
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var ApiService = (function () {
    function ApiService(http, cookieService) {
        this.http = http;
        this.cookieService = cookieService;
        console.log('--> APIService started');
    }
    ApiService.prototype.extractData = function (res) {
        var body = res.json();
        //this will update the token after each server call
        return body.data || {};
    };
    ApiService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        var body = error.json();
        var errMsg = body.message || {};
        return Rx_1.Observable.throw(errMsg);
    };
    ApiService.prototype.fixedEncodeURI = function (str) {
        return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
    };
    ApiService.prototype.getHealth = function () {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.cookieService.getToken()
        });
        var reqOptions = new http_1.RequestOptions({ headers: headers });
        return this.http.get(window.location.origin + '/health', reqOptions)
            .map(this.extractData)
            .catch(this.handleError);
    };
    ApiService.prototype.getUserInfo = function () {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.cookieService.getToken()
        });
        var reqOptions = new http_1.RequestOptions({ headers: headers });
        return this.http.get(window.location.origin + '/userinfo', reqOptions)
            .map(this.extractData)
            .catch(this.handleError);
    };
    //function to extract URL parameters
    ApiService.prototype.getAllUrlParams = function (url) {
        // get query string from url (optional) or window
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
        // we'll store the parameters here
        var obj = {};
        // if query string exists
        if (queryString) {
            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];
            // split our query string into its component parts
            var arr = queryString.split('&');
            var _loop_1 = function (i) {
                // separate the keys and the values
                var a = arr[i].split('=');
                // in case params look like: list[]=thing1&list[]=thing2
                var paramNum = undefined;
                paramName = a[0].replace(/\[\d*\]/, function (v) {
                    paramNum = v.slice(1, -1);
                    return '';
                });
                // set parameter value (use 'true' if empty)
                paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                //paramValue = paramValue.toLowerCase();
                // if parameter name already exists
                if (obj[paramName]) {
                    // convert value to array (if still string)
                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }
                    // if no array index number specified...
                    if (typeof paramNum === 'undefined') {
                        // put the value on the end of the array
                        obj[paramName].push(paramValue);
                    }
                    else {
                        // put the value at that index number
                        obj[paramName][paramNum] = paramValue;
                    }
                }
                else {
                    obj[paramName] = paramValue;
                }
            };
            var paramName, paramValue;
            for (var i = 0; i < arr.length; i++) {
                _loop_1(i);
            }
        }
        return obj;
    };
    return ApiService;
}());
ApiService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, app_cookie_1.CookieService])
], ApiService);
exports.ApiService = ApiService;
//# sourceMappingURL=app.api.js.map