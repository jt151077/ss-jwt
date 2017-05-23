import {Component, AfterViewInit} from '@angular/core';

import {ApiService} from '../../services/app.api';
import {CookieService} from '../../services/app.cookie';
import {UserInfo} from "../../models/UserInfo";

@Component({
	selector: 'home-component',
	providers: [ApiService, CookieService],
	templateUrl: `app/components/home/home.html`
})
export class HomeComponent  implements AfterViewInit {

	msidn: string;

	constructor(private apiService: ApiService, private cookieService: CookieService) {
		console.log('--> HomeController: started');
	}

	//starts when DOM is finished rendering
	ngAfterViewInit():void {
		//check whether a token is provided as a parameter
		let sessionToken = this.cookieService.getToken();

		if(sessionToken === null) {
			//check authentication
			this.cookieService.deleteSessionInfo();
		}
	}

	getUser():void {
		//attempt to get current user's info
		this.apiService.getUserInfo().subscribe(
			(result: UserInfo) => {
				console.log('--> getUserInfo: success: '+JSON.stringify(result));
				//store new temporary token
				this.cookieService.setToken(result.token);
				//update view with phone number
				this.msidn = result.user.phone_number;
			},
			(error) => {
				console.log('--> getUserInfo: error: '+JSON.stringify(error));
				//connection error, delete all cookies
				this.cookieService.deleteSessionInfo();
			}
		);
	}
}
