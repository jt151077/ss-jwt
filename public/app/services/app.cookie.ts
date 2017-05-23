import { Cookie } from 'ng2-cookies/ng2-cookies';
import {Injectable} from "@angular/core";

@Injectable()
export class CookieService {

    private tokenName:string = 'self-service-token';

    deleteSessionInfo(): void {
        //remove all traces...
        Cookie.delete(this.tokenName);
        //refresh to landing page
        window.location.href = window.location.origin + '/';
    }

    getToken(): string {
        return Cookie.get(this.tokenName);
    }

    setToken(token: string): void {
        Cookie.set(this.tokenName, token);
    }
}