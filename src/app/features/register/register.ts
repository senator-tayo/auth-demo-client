import { CommonModule } from '@angular/common';import { Component, inject, signal } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth/auth';

function passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';
  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/~`;']/.test(value);

  return hasLetter && hasNumber && hasSpecial ? null : { complexity: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
    private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), passwordComplexityValidator]],
  });

 

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService
      .register({
        email: this.form.value.email!,
        password: this.form.value.password!,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(
            err.status === 409
              ? 'An account with this email already exists.'
              : 'Registration failed. Please check your details.'
          );
        },
      });
  }
}