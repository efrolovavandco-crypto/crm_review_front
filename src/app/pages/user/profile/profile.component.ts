import {Component, ViewChild} from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../_interface/user';
import {AuthenticationService} from "../../../_services/authentication-service";
import {EditProfileComponent} from "../../../_component/edit-profile/edit-profile.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {

  user$: Observable<User | null>;
  isOpen=false;
  constructor(private authService: AuthenticationService) {
    this.user$ = this.authService.user;
  }
  @ViewChild(EditProfileComponent) editProfile!: EditProfileComponent
  getGenderText(gender: string | undefined): string {
    if (!gender) return 'Не указан';
    return gender === 'male' ? 'Мужской' : 'Женский';
  }
  getPositionText(position: string | undefined): string {
    if (!position) return 'Не указана';

    const positionMap: Record<string, string> = {
      'loader': 'Грузчик',
      'courier': 'Курьер',
      'accountant': 'Бухгалтер',
      'manager': 'Менеджер',
      'user': 'Пользователь',
      'admin': 'Администратор'
    };

    return positionMap[position] || position;
  }
  openEditProfile(user:User){
    this.editProfile.open(user)
  }
}
