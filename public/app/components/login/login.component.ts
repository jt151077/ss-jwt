import {Component, AfterViewInit} from '@angular/core';

import {ApiService} from '../../services/app.api';
import {CookieService} from '../../services/app.cookie';
import {Router} from "@angular/router";

import {MessageInfo} from "../../models/MessageInfo";

@Component({
	selector: 'login-component',
	providers: [ApiService, CookieService],
	templateUrl: `app/components/login/login.html`
})
export class LoginComponent implements AfterViewInit {

	constructor(private apiService: ApiService, private cookieService: CookieService, private router: Router) {
		console.log('--> LoginController: started');
	}

	//starts when DOM is finished rendering
	ngAfterViewInit():void {
		console.log('--> LoginController: ready');
		//check whether a token is provided as a parameter
		let urlToken = this.apiService.getAllUrlParams(window.location.href)['token'] || '';

		if(urlToken !== '') {
			//persist the received token
			this.cookieService.setToken(urlToken);
			//test server connection
			this.getHealth();
		}
	}

	login():void {
		//call the API's authentication endpoint
		window.location.href = window.location.origin + '/auth';
	}

	getHealth():void {
		//attempt to get API's health status
		this.apiService.getHealth().subscribe(
			(result: MessageInfo) => {
				console.log('--> getHealth: success: '+JSON.stringify(result));
				//store new temporary token
				this.cookieService.setToken(result.token);
				//navigate to home view
				this.router.navigateByUrl('home');
			},
			(error) => {
				console.log('--> getHealth: error: '+JSON.stringify(error));
				//connection error, delete all cookies
				this.cookieService.deleteSessionInfo();
			}
		);
	}
}
