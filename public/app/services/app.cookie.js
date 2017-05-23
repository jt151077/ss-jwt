"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ng2_cookies_1 = require("ng2-cookies/ng2-cookies");
var core_1 = require("@angular/core");
var CookieService = (function () {
    function CookieService() {
        this.tokenName = 'self-service-token';
    }
    CookieService.prototype.deleteSessionInfo = function () {
        //remove all traces...
        ng2_cookies_1.Cookie.delete(this.tokenName);
        //refresh to landing page
        window.location.href = window.location.origin + '/';
    };
    CookieService.prototype.getToken = function () {
        return ng2_cookies_1.Cookie.get(this.tokenName);
    };
    CookieService.prototype.setToken = function (token) {
        ng2_cookies_1.Cookie.set(this.tokenName, token);
    };
    return CookieService;
}());
CookieService = __decorate([
    core_1.Injectable()
], CookieService);
exports.CookieService = CookieService;
//# sourceMappingURL=app.cookie.js.map