import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { AuthenticationService } from "../_services/authentication-service";
import { Router } from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Subscription} from "rxjs";


export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const usernameRegex = /^[A-Za-z0-9 ]+$/;
    const isValid = usernameRegex.test(control.value);

    return isValid ? null : {
      englishLettersOnly: true,
      message: 'Логин должен содержать только английские буквы'
    };
  };
}

export function passwordValidator():ValidatorFn{
  return (control:AbstractControl): ValidationErrors | null =>{
    const value = control.value;
    if (!value){
      return null
    }
    const passRegex = /^[A-Za-z0-9 ]+$/;
    const isValid = passRegex.test(value);
    return isValid ? null :{
      passwordValid:true,
      message:'Пароль должен содержать только цифры и английские буквы'
    }
  }
}
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  error: string = '';
  authForm!: FormGroup;
  subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
) {}

  ngOnInit() {
    this.authForm = this.fb.group({
      username: ['', [Validators.required, usernameValidator()]],
      password: ['', [Validators.required, passwordValidator()]]
    });
    console.log(this.authForm)
  }
  get f() {
    return this.authForm.controls;
  }

  private redirectByRole(role: string) {
    if (role === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'User') {
      this.router.navigate(['/user']);
    }
  }

  onSubmit() {
    this.error = '';
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.subscription.add(this.authenticationService.login(
      this.authForm.value.username,
      this.authForm.value.password
    ).subscribe({
      next: (user: any) => {
        this.loading = false;

        if (!user || !user.role) return;

        this.redirectByRole(user.role);
        console.log('подписка')
      },
      error: (error: any) => {
        this.toastrService.error('Неправильные логин или пароль', 'Ошибка входа:');
        this.loading = false;
      }
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
    console.log('отписка')
  }
}
