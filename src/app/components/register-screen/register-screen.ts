import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserRegisterDTO } from '../../models/userRegisterDTO';  

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register-screen.html',
  styleUrls: ['./register-screen.css']
})
export class RegisterScreen implements OnInit {
  registerForm!: FormGroup;
  hidePassword: boolean = true;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  
  get f() {
    return this.registerForm.controls;
  }

  

  onRegister(): void {
    
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.registerForm.disable();

    
    const userRegisterDTO: UserRegisterDTO = {
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value,
      authorityId: 4  
    };

    
    this.userService.registerUser(userRegisterDTO).subscribe({
      next: (response) => {
        this.snackBar.open('¡Cuenta creada exitosamente! Redirigiendo a login...');
        console.log('Usuario registrado correctamente', response);

        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.registerForm.enable();
        const errorMsg = error.error?.message || error.message || 'Error al registrar el usuario. Intenta de nuevo.';
        this.errorMessage = errorMsg;
        this.snackBar.open(errorMsg);
        console.error('Error al registrar el usuario', error);
      },
      complete: () => {
        this.isLoading = false;
        this.registerForm.enable();
      }
    });
  }
}
