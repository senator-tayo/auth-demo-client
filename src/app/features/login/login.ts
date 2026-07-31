import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth/auth';
import { AlertService } from '../../core/utility/AlertService';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

 onSubmit(): void {
  if (this.form.invalid) return;

  this.loading.set(true);
  this.errorMessage.set(null);
  this.alert.loading('Signing in...');

  this.authService
    .login({
      email: this.form.value.email!,
      password: this.form.value.password!,
    })
    .pipe(
      finalize(() => {
        this.loading.set(false);
        this.alert.close();
      })
    )
    .subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage.set('Invalid email or password.');
        this.alert.error('Invalid email or password.');
      },
    });
}
}