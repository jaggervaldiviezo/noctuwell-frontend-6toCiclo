import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user-service';
import { SpecialistService } from '../../services/specialist-service';
import { PatientService } from '../../services/patient-service';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  userRole: string = '';
  userName: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private specialistService: SpecialistService,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateUserRole();
    
    
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateUserRole();
      });
  }

  private updateUserRole(): void {
    if (this.userService.isLogged()) {
      const userId = this.userService.getUserId();
      const authorities = this.userService.getAuthorities() || '';
      
      
      if (authorities.includes('ROLE_ADMIN')) {
        this.userRole = 'ADMIN';
        this.userName = ''; 
        
      } else if (authorities.includes('ROLE_SPECIALIST')) {
        this.userRole = 'SPECIALIST';
        this.loadSpecialistData(userId);
      } else if (authorities.includes('ROLE_PATIENT')) {
        this.userRole = 'PATIENT';
        this.loadPatientData(userId);
      } else {
        this.userRole = authorities.split(',')[0]?.replace('ROLE_', '') || 'USER';
        this.userName = '';
      }
    } else {
      this.userRole = '';
      this.userName = '';
    }
  }

  private loadSpecialistData(userId: number): void {
    this.specialistService.getMyProfile().subscribe({
      next: (data) => {
        this.userName = `${data.firstName} ${data.lastName}`;
      },
      error: (err) => {
        console.warn('Sesión inválida o expirada (Specialist). Cerrando sesión...', err);
        
        this.Logout(); 
      }
    });
  }

  private loadPatientData(userId: number): void {
    this.patientService.getPatientByUserId(userId).subscribe({
      next: (data) => {
        this.userName = `${data.firstName} ${data.lastName}`;
      },
      error: (err) => {
        console.warn('Sesión inválida o expirada (Patient). Cerrando sesión...', err);
        
        this.Logout();
      }
    });
  }

  Logout() {
    this.userService.logout();
    this.userRole = '';
    this.userName = '';
    this.router.navigate(['/login']);
  }

  HayUsuario() {
    return this.userService.isLogged();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

