import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {UserService} from "../../_services/user-service";
import {User} from "../../_interface/user";


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
export class EditModal{
  isOpen=false;
  editForm!:FormGroup;
  UserId!:number;
  positions= [
    { value: 'loader', label: 'Грузчик' },
    { value: 'courier', label: 'Курьер' },
    { value: 'accountant', label: 'Бухгалтер' },
    { value: 'manager', label: 'Менеджер' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.editForm = this.fb.group({
      fullname:['', [fullnameValidator()]],
      phone:['', [numberValidator()]],
      age:['',  [numberValidator()]],
      gender:[''],
      position:['']
    })
  }


  open(user:User){
    this.isOpen=true;
    this.UserId = user.id;
    this.editForm.patchValue({
      fullname:user.fullname,
      phone:user.phone,
      age:user.age,
      gender:user.gender,
      position:user.position
    })
  }
  close(){
    this.isOpen=false
  }
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
      id:this.UserId
    }
    this.userService.update(updatedUser).subscribe({
      next:()=>{
        this.isOpen=false
        console.log(updatedUser)
      },

      error:err=>{
        console.log(err)
    }
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
}
