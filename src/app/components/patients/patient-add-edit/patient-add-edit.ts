import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient-service';
import { UserService } from '../../../services/user-service';
import { PlanService } from '../../../services/plan-service';
import { PatientDTO } from '../../../models/patientDTO';
import { UserDTO } from '../../../models/userDTO';
import { PlanDTO } from '../../../models/planDTO';

@Component({
  selector: 'app-patients-add-edit',
  standalone: false,
  templateUrl: './patient-add-edit.html',
  styleUrls: ['./patient-add-edit.css'],
})
export class PatientsAddEdit implements OnInit {
  crudForm!: FormGroup;
  patientId: number = 0;
  today: Date = new Date();

  listaUsuarios: UserDTO[] = [];
  listaPlanes: PlanDTO[] = [];
  listaUsuariosDisponibles: UserDTO[] = [];

  constructor(
    private patientService: PatientService,
    private userService: UserService,
    private planService: PlanService,
    private formBuilder: FormBuilder,
    private snack: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.CargarListas();
    this.CargarFormulario();
  }
CargarListas() {
  
  this.userService.listAll().subscribe({
    next: (data: UserDTO[]) => {
      this.listaUsuarios = data;
      this.listaUsuariosDisponibles = data;  
      
      
      const allUserIds: number[] = data.map(user => user.id);
      
      
      console.log('IDs de todos los usuarios:', allUserIds);
    },
    error: (err) => console.error('Error al cargar usuarios', err),
  });

  
  this.planService.listAll().subscribe({
    next: (data: PlanDTO[]) => {
      this.listaPlanes = data;
    },
    error: (err) => console.error('Error al cargar planes', err),
  });
}


  
  CargarFormulario() {
    this.crudForm = this.formBuilder.group({
      id: [''],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(1), Validators.max(300)]],
      height: [0, [Validators.required, Validators.min(30), Validators.max(250)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      birthDate: ['', [Validators.required, this.ageValidator]],
      userId: ['', Validators.required],
      planId: ['', Validators.required],
    });

    
    this.patientId = parseInt(this.activatedRoute.snapshot.params['id']);

    if (this.patientId > 0 && !isNaN(this.patientId)) {
      this.patientService.findById(this.patientId).subscribe({
        next: (data: any) => {
          const birth = data.birthDate ? new Date(data.birthDate) : null;
          this.crudForm.patchValue({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            weight: data.weight,
            height: data.height,
            phone: data.phone,
            birthDate: birth,
            userId: data.user.id,
            planId: data.plan.id,
          });
        },
        error: (err) => console.error('Error al cargar paciente', err),
      });
    }
  }

  
  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  
  ageValidator(control: any) {
    const birthDate = control.value;
    if (birthDate) {
      const today = new Date();
      const birthDateObj = new Date(birthDate);

      let age = today.getFullYear() - birthDateObj.getFullYear();
      const month = today.getMonth() - birthDateObj.getMonth();
      const day = today.getDate() - birthDateObj.getDate();

      if (age < 18 || (age === 18 && (month < 0 || (month === 0 && day < 0)))) {
        return { underage: true };
      }
    }
    return null;
  }

  
  formatDateToYMD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  
  Grabar() {
    if (this.crudForm.invalid) {
      return;
    }

    const birthControl = this.crudForm.get('birthDate')?.value;
    let birthDateStr: string | null = null;

    if (birthControl instanceof Date) {
      birthDateStr = this.formatDateToYMD(birthControl);
    } else if (typeof birthControl === 'string') {
      birthDateStr = birthControl;
    }

    const patient: PatientDTO = {
      id: this.crudForm.get('id')?.value ? this.crudForm.get('id')?.value : 0,
      firstName: this.crudForm.get('firstName')?.value,
      lastName: this.crudForm.get('lastName')?.value,
      gender: this.crudForm.get('gender')?.value,
      weight: this.crudForm.get('weight')?.value,
      height: this.crudForm.get('height')?.value,
      phone: this.crudForm.get('phone')?.value,
      birthDate: birthDateStr ?? '',
      userId: this.crudForm.get('userId')?.value,
      planId: this.crudForm.get('planId')?.value,
    };

    if (this.patientId > 0) {
      
      this.patientService.edit(patient).subscribe({
        next: () => {
          this.snack.open('Se actualizó el Paciente correctamente', 'OK', { 
            duration: 2000 
          });
          this.router.navigate(['/patient-list']);
        },
        error: (http_error) => {
          this.snack.open('ERROR al actualizar: ' + http_error.message, 'OK', { 
            duration: 5000 
          });
        },
      });
    }  else {
  
  this.patientService.new(patient).subscribe({
    next: () => {
      this.snack.open('Se registró el nuevo Paciente', 'OK', { 
        duration: 2000 
      });
      
      
      const nuevaLista = [];
      for (let i = 0; i < this.listaUsuariosDisponibles.length; i++) {
        if (this.listaUsuariosDisponibles[i].id !== patient.userId) {
          nuevaLista.push(this.listaUsuariosDisponibles[i]);
        }
      }
      this.listaUsuariosDisponibles = nuevaLista;

      
      const usuarioSeleccionado = this.listaUsuarios.find(u => u.id === patient.userId);
      
      if (usuarioSeleccionado) {
        
        this.userService.updateUserAuthority({
          username: usuarioSeleccionado.username,  
          authorities: 'ROLE_PATIENT'
        }).subscribe({
          next: () => {
            this.snack.open('Rol de usuario actualizado a ROLE_PATIENT', 'OK', { 
              duration: 2000 
            });
          },
          error: (http_error) => {
            this.snack.open('ERROR al actualizar el rol: ' + http_error.message, 'OK', { 
              duration: 5000 
            });
          }
        });
      }

      this.router.navigate(['/patient-list']);
    },
    error: (http_error) => {
      this.snack.open('ERROR al registrar: ' + http_error.message, 'OK', { 
        duration: 5000 
      });
    },
  });
    }}}
