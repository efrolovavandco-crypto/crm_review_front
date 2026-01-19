import { Component } from '@angular/core';
import {AuthenticationService} from "../../_services/authentication-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  private router!: Router;
  constructor(
    private authService:AuthenticationService
  ) {
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
