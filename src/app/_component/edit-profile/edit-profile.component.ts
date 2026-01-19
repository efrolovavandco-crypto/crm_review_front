import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {UserService} from "../../_services/user-service";
import {User} from "../../_interface/user";
import {AuthenticationService} from "../../_services/authentication-service";

export function numberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const digitsRegex = /^[0-9]+$/;
    const isValid = digitsRegex.test(value);

    return isValid ? null : { onlyDigits: 'Это поле должно содержать только цифры' };
  };
}
export function fullnameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const digitsRegex = /^[А-я ]+$/;
    const isValid = digitsRegex.test(value);

    return isValid ? null : { onlyDigits: 'Это поле должно содержать только русские буквы' };
  };
}
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  isOpen=false;
  formEditProfile!:FormGroup;
  UserId!:number;
  positions= [
    { value: 'loader', label: 'Грузчик' },
    { value: 'courier', label: 'Курьер' },
    { value: 'accountant', label: 'Бухгалтер' },
    { value: 'manager', label: 'Менеджер' }
  ];
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthenticationService
  ) {
    this.formEditProfile = this.fb.group({
      fullname:['',[fullnameValidator()]],
      phone:['',[numberValidator()]],
      age:['',[numberValidator()]],
      gender:[''],
      position: [{ value: '', disabled: true }]
    })
  }
  open(user: User) {
    this.isOpen = true;
    this.UserId = user.id;

    this.formEditProfile.patchValue({
      fullname: user.fullname,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
      position: user.position
    });

    this.formEditProfile.get('position')?.disable();
  }

  submit() {
    if (this.formEditProfile.invalid) return;

    const updatedUser: User = {
      ...this.formEditProfile.getRawValue(),
      id: this.UserId
    };

    this.userService.update(updatedUser).subscribe({
      next: (user) => {
        this.authService.updateUserLocalStorage(user);
        this.isOpen = false;
        console.log(user)
      },
      error: err => console.error(err)
    });
  }

  get fullname() {
    return this.formEditProfile.get('fullname');
  }
  get age() {
    return this.formEditProfile.get('age');
  }
  get phone() {
    return this.formEditProfile.get('phone');
  }
}
