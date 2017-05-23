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
var core_1 = require("@angular/core");
var app_api_1 = require("../../services/app.api");
var app_cookie_1 = require("../../services/app.cookie");
var router_1 = require("@angular/router");
var LoginComponent = (function () {
    function LoginComponent(apiService, cookieService, router) {
        this.apiService = apiService;
        this.cookieService = cookieService;
        this.router = router;
        console.log('--> LoginController: started');
    }
    //starts when DOM is finished rendering
    LoginComponent.prototype.ngAfterViewInit = function () {
        console.log('--> LoginController: ready');
        //check whether a token is provided as a parameter
        var urlToken = this.apiService.getAllUrlParams(window.location.href)['token'] || '';
        if (urlToken !== '') {
            //persist the received token
            this.cookieService.setToken(urlToken);
            //test server connection
            this.getHealth();
        }
    };
    LoginComponent.prototype.login = function () {
        //call the API's authentication endpoint
        window.location.href = window.location.origin + '/auth';
    };
    LoginComponent.prototype.getHealth = function () {
        var _this = this;
        //attempt to get API's health status
        this.apiService.getHealth().subscribe(function (result) {
            console.log('--> getHealth: success: ' + JSON.stringify(result));
            //store new temporary token
            _this.cookieService.setToken(result.token);
            //navigate to home view
            _this.router.navigateByUrl('home');
        }, function (error) {
            console.log('--> getHealth: error: ' + JSON.stringify(error));
            //connection error, delete all cookies
            _this.cookieService.deleteSessionInfo();
        });
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        selector: 'login-component',
        providers: [app_api_1.ApiService, app_cookie_1.CookieService],
        templateUrl: "app/components/login/login.html"
    }),
    __metadata("design:paramtypes", [app_api_1.ApiService, app_cookie_1.CookieService, router_1.Router])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map