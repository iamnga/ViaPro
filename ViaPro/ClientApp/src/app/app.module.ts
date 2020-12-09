import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// RECOMMENDED
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import {
  OKTA_CONFIG,
  OktaAuthModule
} from '@okta/okta-angular';
import { OktaCallbackComponent } from '@okta/okta-angular';
import { OktaAuthGuard } from '@okta/okta-angular';
import { environment } from '../environments/environment';

const CALLBACK_PATH = 'implicit/callback';
const OKTA_DOMAIN = 'dev-7318036.okta.com';
const CLIENT_ID = environment.clientID;
const ISSUER = `https://${OKTA_DOMAIN}/oauth2/default`;
const HOST = window.location.host;
const REDIRECT_URI = `https://${HOST}/${CALLBACK_PATH}`;
const SCOPES = 'openid profile email';
const config = {
  issuer: ISSUER,
  clientId: CLIENT_ID,
  redirectUri: REDIRECT_URI,
  scope: SCOPES.split(/\s+/),
  pkce: true
};

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent
  ],
  imports: [
    OktaAuthModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    NgxDatatableModule,
    BsDatepickerModule.forRoot(),
    SweetAlert2Module.forRoot(),
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [OktaAuthGuard] },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      {
        path: CALLBACK_PATH,
        component: OktaCallbackComponent,
      },
    ]),
  ],
  providers: [{ provide: OKTA_CONFIG, useValue: config }],
  bootstrap: [AppComponent]
})
export class AppModule { }
