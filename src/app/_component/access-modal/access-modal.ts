import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {UserService} from "../../_services/user-service";
import {User} from "../../_interface/user";
import {usernameValidator} from "../../auth/auth.component";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";

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
export class AccessModal implements OnInit, OnDestroy{
  accessForm!: FormGroup;
  @Input() user!: User;
  subscription = new Subscription();
  constructor
  (
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private userService: UserService
    )
  {}
  ngOnInit() {
    this.accessForm=this.fb.group({
      id:[this.user.id],
      username:[this.user.username],
      password:[this.user.password],
      new_password:['',[Validators.required,newPasswordValidator()]]
    })
  }

  submit(){
    const password= this.accessForm.get('new_password')?.value
    this.subscription.add(
      this.userService.changePassword(this.user.id, password).subscribe({
        next:()=>{
          this.activeModal.close(true);
        },
        error:err=>{
          console.log(err)
      }
    }))
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
    console.log('отписка была')
  }

}
