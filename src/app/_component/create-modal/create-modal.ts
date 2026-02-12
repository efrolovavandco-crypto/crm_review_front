import {Component, OnDestroy} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {UserService} from "../../_services/user-service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";

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
  selector: 'app-create-modal',
  templateUrl: './create-modal.html',
  styleUrls: ['./create-modal.css'],
})
export class CreateModal implements OnDestroy{
  subscription= new Subscription;
  addForm!: FormGroup;

  positions = [
    { value: 'loader', label: 'Грузчик' },
    { value: 'courier', label: 'Курьер' },
    { value: 'accountant', label: 'Бухгалтер' },
    { value: 'manager', label: 'Менеджер' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public activeModal:NgbActiveModal
  ) {
    this.initForm();
  }

  initForm() {
    this.addForm = this.fb.group({
      fullname: ['',[fullnameValidator()]],
      phone: ['',numberValidator()],
      age: [null, numberValidator()],
      gender: ['',],
      position: ['', Validators.required]
    });
  }

  addUser() {
    if (this.addForm.invalid) return;
    const newUser = {
      ...this.addForm.value,
      role: 'User'
    };

    this.subscription.add(
      this.userService.create(newUser).subscribe({
        next: (createdUser) => {
          console.log(createdUser);
          this.activeModal.close(true);
      },
        error: (error) => {
          console.error(error);
      }
    }));
  }

  isInvalid(field: string): boolean {
    const control = this.addForm.get(field);
    return !!(control && control.invalid && control.touched);
  }
  get fullname(){
    return this.addForm.get('fullname');
  }
  get age(){
    return this.addForm.get('age');
  }
  get phone(){
    return this.addForm.get('phone');
  }
  ngOnDestroy()
  {
    this.subscription.unsubscribe();
    console.log('отписка у создающего модального окна')
  }

}
