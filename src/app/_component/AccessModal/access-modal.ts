import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {UserService} from "../../_services/user-service";
import {User} from "../../_interface/user";
import {usernameValidator} from "../../auth/auth.component";

//Валидация пароля доступны тололько цифры и англ символы
export function newPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const usernameRegex = /^[A-Za-z0-9]+$/;
    const isValid = usernameRegex.test(control.value);

    return isValid ? null : {
      englishLettersOnly: true,
      message: 'Пароль должен содержать только английские буквы'
    };
  };
}

@Component({
  selector: 'app-access-modal',
  templateUrl: './access-modal.html',
  styleUrls: ['./access-modal.css'],
})
export class AccessModal {
  accessForm!: FormGroup;
  userId!:number;
  constructor
  (
    private fb: FormBuilder,
    private userService: UserService
    )
  {
    this.accessForm=this.fb.group({
      id:[''],
      username:[''],
      password:[''],
      new_password:['',[Validators.required,newPasswordValidator()]]
    })
  }

  isOpen=false;
  password: any;
  new_password: any;
  open(user:User){
    this.userId=user.id;
    this.isOpen = true;
    this.accessForm.patchValue({
      id:user.id,
      username:user.username,
      password:user.password,
    })
  }
  close(){
    this.isOpen = false
  }
  submit(){
    const password= this.accessForm.get('new_password')?.value
    console.log(this.userId)
    this.userService.changePassword(this.userId, password).subscribe({
      next:()=>{
        this.isOpen=false
        this.accessForm.reset()
      },
      error:err=>{
        console.log(err)
      }
    })
  }

}
