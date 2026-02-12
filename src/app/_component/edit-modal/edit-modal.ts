import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {UserService} from "../../_services/user-service";
import {User} from "../../_interface/user";
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
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.html',
  styleUrls: ['./edit-modal.css'],
})
export class EditModal implements OnInit, OnDestroy{
  @Input() user!: User;
  editForm!:FormGroup;
  subscription = new Subscription();
  positions= [
    { value: 'loader', label: 'Грузчик' },
    { value: 'courier', label: 'Курьер' },
    { value: 'accountant', label: 'Бухгалтер' },
    { value: 'manager', label: 'Менеджер' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public activeModal: NgbActiveModal,
  ) {}

  submit(){
    if (this.editForm.invalid) {
      return
    }

    const updatedUser:User={
      fullname:this.editForm.value.fullname,
      phone:this.editForm.value.phone,
      age:this.editForm.value.age,
      gender:this.editForm.value.gender,
      position:this.editForm.value.position,
      id:this.user.id
    }
    this.subscription.add(
      this.userService.update(updatedUser).subscribe({
      next:()=>{
        this.activeModal.close(true);
        console.log(updatedUser)
      },

      error:err=>{
        console.log(err)
    }
    }))
  }
  ngOnInit() {
    this.editForm = this.fb.group({
      fullname:[this.user.fullname, [fullnameValidator()]],
      phone:[this.user.phone, [numberValidator()]],
      age:[this.user.age,  [numberValidator()]],
      gender:[this.user.gender],
      position:[this.user.position]
    })
  }

  get age() {
    return this.editForm.get('age');
  }
  get phone() {
    return this.editForm.get('phone');
  }
  get fullname() {
    return this.editForm.get('fullname');
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
    console.log('отписка')
  }
}
