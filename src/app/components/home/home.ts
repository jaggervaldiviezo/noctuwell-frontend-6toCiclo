import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
isPatient: boolean = false;
  isSpecialist: boolean = false;
  isAdmin: boolean = false;
  userId: number = 0;
  

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    if (!this.userService.isLogged()) {
      this.router.navigate(['/login']);
      return;
    }

    
    this.isPatient = this.userService.isPatient();
    this.isSpecialist = this.userService.isSpecialist();
    this.isAdmin = this.userService.isAdmin();

    
    this.userId = this.userService.getUserId();
    
    
    console.log(`Roles: Paciente=${this.isPatient}, Especialista=${this.isSpecialist}, Admin=${this.isAdmin}`);
  }
  
}
