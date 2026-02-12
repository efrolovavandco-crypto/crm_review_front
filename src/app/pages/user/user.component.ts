import { Component } from '@angular/core';
import {AuthenticationService} from "../../_services/authentication-service";
import {Router} from "@angular/router";
import {Poll} from "../../_interface/polls";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  private router!: Router;
  activeTab: 'profile' | 'polls' = 'profile';
  userPolls: Poll[] = [];
  constructor(
    private authService:AuthenticationService
  ) {
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
  setActiveTab(tab: 'profile' | 'polls'): void {
    this.activeTab = tab;

    // Если переключаемся на опросы и они еще не загружены
    if (tab === 'polls' && this.userPolls.length === 0) {

    }
  }
}
