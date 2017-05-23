/*** angular ***/
import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {CookieService} from './app.cookie';

/*** models ***/


// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {

	constructor(private http: Http, private cookieService: CookieService) {
		console.log('--> APIService started');
	}

	private extractData(res: Response) {
		let body = res.json();
		//this will update the token after each server call
		return body.data || { };
	}

	private handleError (error: Response | any) {
		// In a real world app, we might use a remote logging infrastructure
		let body = error.json();
		let errMsg = body.message || { };
		return Observable.throw(errMsg);
	}

	private fixedEncodeURI(str: string): string {
		return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
	}

	getHealth(): Observable<any> {

		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + this.cookieService.getToken()
		});
		let reqOptions = new RequestOptions({headers: headers});
		return this.http.get(window.location.origin + '/health', reqOptions)
            .map(this.extractData)
            .catch(this.handleError);
	}

	getUserInfo(): Observable<any> {

		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + this.cookieService.getToken()
		});
		let reqOptions = new RequestOptions({headers: headers});
		return this.http.get(window.location.origin + '/userinfo', reqOptions)
            .map(this.extractData)
            .catch(this.handleError);
	}

	//function to extract URL parameters
	getAllUrlParams(url: string): {} {

		// get query string from url (optional) or window
		let queryString = url ? url.split('?')[1] : window.location.search.slice(1);
		// we'll store the parameters here
		let obj = {};
		// if query string exists
		if (queryString) {
			// stuff after # is not part of query string, so get rid of it
			queryString = queryString.split('#')[0];
			// split our query string into its component parts
			let arr = queryString.split('&');
			for (let i=0; i<arr.length; i++) {
				// separate the keys and the values
				let a = arr[i].split('=');
				// in case params look like: list[]=thing1&list[]=thing2
				let paramNum: any = undefined;
				var paramName = a[0].replace(/\[\d*\]/, function(v) {
					paramNum = v.slice(1,-1);
					return '';
				});
				// set parameter value (use 'true' if empty)
				var paramValue: any = typeof(a[1])==='undefined' ? true : a[1];
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
					// if array index number specified...
					else {
						// put the value at that index number
						obj[paramName][paramNum] = paramValue;
					}
				}
				// if param name doesn't exist yet, set it
				else {
					obj[paramName] = paramValue;
				}
			}
		}
		return obj;
	}
}
