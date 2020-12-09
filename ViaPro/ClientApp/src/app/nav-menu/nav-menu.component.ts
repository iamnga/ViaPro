import { Component } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { Router } from "@angular/router";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  constructor(public oktaAuth: OktaAuthService, public router: Router) {
  }
  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  signOutAdmin() {
    this.oktaAuth.signOut();
  }
}
