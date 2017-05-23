import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, JsonpModule} from '@angular/http';

import {AppComponent}  from './app.component';
import {HomeComponent}  from './components/home/home.component';
import {LoginComponent}  from './components/login/login.component';

import {MaterialModule} from "@angular/material";
import {RouterModule, Routes} from "@angular/router";


/* services imports */
const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'home', component: HomeComponent },
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
		MaterialModule.forRoot(),
		RouterModule.forRoot(routes, {useHash: true})
	],
	declarations: [
		AppComponent,
		HomeComponent,
		LoginComponent
	],
	bootstrap: [
		AppComponent
	],
	providers: []
})
export class AppModule {
}
