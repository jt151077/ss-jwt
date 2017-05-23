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
var HomeComponent = (function () {
    function HomeComponent(apiService, cookieService) {
        this.apiService = apiService;
        this.cookieService = cookieService;
        console.log('--> HomeController: started');
    }
    //starts when DOM is finished rendering
    HomeComponent.prototype.ngAfterViewInit = function () {
        //check whether a token is provided as a parameter
        var sessionToken = this.cookieService.getToken();
        if (sessionToken === null) {
            //check authentication
            this.cookieService.deleteSessionInfo();
        }
    };
    HomeComponent.prototype.getUser = function () {
        var _this = this;
        //attempt to get current user's info
        this.apiService.getUserInfo().subscribe(function (result) {
            console.log('--> getUserInfo: success: ' + JSON.stringify(result));
            //store new temporary token
            _this.cookieService.setToken(result.token);
            //update view with phone number
            _this.msidn = result.user.phone_number;
        }, function (error) {
            console.log('--> getUserInfo: error: ' + JSON.stringify(error));
            //connection error, delete all cookies
            _this.cookieService.deleteSessionInfo();
        });
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        selector: 'home-component',
        providers: [app_api_1.ApiService, app_cookie_1.CookieService],
        templateUrl: "app/components/home/home.html"
    }),
    __metadata("design:paramtypes", [app_api_1.ApiService, app_cookie_1.CookieService])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map