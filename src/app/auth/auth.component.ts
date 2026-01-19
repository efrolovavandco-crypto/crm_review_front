import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loading: boolean = false;
  error: string = '';
  authForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.authForm = this.fb.group({
      username: ['', [Validators.required,usernameValidator()]],
      password: ['', Validators.required]
    });
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
      Object.keys(this.f).forEach(key => {
        const control = this.f[key];
        control.markAsTouched();
      });
      return;
    }

    this.loading = true;

    this.authenticationService.login(
      this.authForm.value.username,
      this.authForm.value.password
    ).subscribe({
      next: (user: any) => {
        this.loading = false;

        if (!user || !user.role) return;

        this.redirectByRole(user.role);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
}
