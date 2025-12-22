import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { DiagnosisService } from '../../../services/diagnosis-service';
import { AppointmentService } from '../../../services/appointment-service';
import { HistoryService } from '../../../services/history-service';
import { PatientService } from '../../../services/patient-service';
import { UserService } from '../../../services/user-service';
import { SpecialistService } from '../../../services/specialist-service';
import { DiagnosisDTO } from '../../../models/diagnosisDTO';
import { Appointment } from '../../../models/appointment';
import { HistoryDTO } from '../../../models/historyDTO';
import { PatientDTO } from '../../../models/patientDTO';
import { DeleteConfirmation } from '../../confirmations/delete-confirmation/delete-confirmation';

@Component({
  selector: 'app-diagnosis-add-edit',
  standalone: false,
  templateUrl: './diagnosis-add-edit.html',
  styleUrl: './diagnosis-add-edit.css',
})
export class DiagnosisAddEdit implements OnInit {
  crudForm!: FormGroup;
  diagnosisId: number = 0;
  
  
  listaAppointments: Appointment[] = [];
  listaHistories: HistoryDTO[] = [];
  listaPatientes: PatientDTO[] = [];
  pacienteSeleccionado: PatientDTO | null = null;
  
  
  specialistId: number = 0;
  
  specialistTypeId: number = 0;
  tipoEspecialistaNombre: string = '';
  tipoDiagnostico: string = '';
  today: Date = new Date();

  constructor(
    private diagnosisService: DiagnosisService,
    private appointmentService: AppointmentService,
    private historyService: HistoryService,
    private patientService: PatientService,
    private userService: UserService,
    private specialistService: SpecialistService,
    private formBuilder: FormBuilder,
    private snack: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    
    const userId = this.userService.getUserId();

    if (userId === 0) {
      this.snack.open('No estás autenticado como especialista', 'OK', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    
    this.specialistService.getMyProfile().subscribe({
      next: (profile: any) => {
        
        this.specialistId = profile.id || this.specialistId;
        this.specialistTypeId = profile.typeSpecialistId || 0;
        this.tipoEspecialistaNombre = (profile as any).typeSpecialist?.name || '';
        
        
        this.tipoDiagnostico = this.obtenerTipoDiagnostico(this.tipoEspecialistaNombre);
        
        
        console.log('UserId (token):', userId);
        console.log('Perfil especialista:', profile);
        console.log('Resolved specialistId:', this.specialistId, 'typeSpecialistId:', this.specialistTypeId);
        this.CargarListas();
        this.CargarFormulario();
      },
      error: (err: any) => {
        console.error('Error al cargar perfil de especialista', err);
        console.log('No se pudo obtener profile; userId:', userId, 'valor specialistTypeId actual:', this.specialistTypeId);
        
        this.CargarListas();
        this.CargarFormulario();
      }
    });
  }

  CargarListas(): void {
    this.appointmentService.list().subscribe({
      next: (data: Appointment[]) => {
        this.listaAppointments = data;
      },
      error: (err) => console.error('Error al cargar citas', err),
    });

    
    this.listaHistories = [];

    this.patientService.listAll().subscribe({
      next: (data: PatientDTO[]) => {
        this.listaPatientes = data;
      },
      error: (err) => console.error('Error al cargar pacientes', err),
    });
  }

  /**
   * Carga las historias clínicas del paciente indicado filtradas por el tipo
   * de especialista del especialista autenticado.
   * Ahora usa el endpoint backend que realiza el filtrado.
   */
  loadHistoriesForPatient(patientId: number): void {
    if (!patientId) {
      this.listaHistories = [];
      return;
    }

    
    console.log('Cargando historias del backend para paciente:', patientId);

    
    this.historyService.getHistoriesByPatientForLoggedSpecialist(patientId).subscribe({
      next: (data: HistoryDTO[]) => {
        console.log('Historias recibidas del backend:', data.length, data);
        this.listaHistories = data;
      },
      error: (err) => {
        console.error('Error al cargar historias del paciente', err);
        this.listaHistories = [];
      }
    });
  }

  CargarFormulario(): void {
    this.crudForm = this.formBuilder.group({
      id: [''],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      recommendations: ['', [Validators.required, Validators.maxLength(500)]],
      date: ['', [Validators.required, this.futureDateValidator.bind(this)]],
      appointmentId: ['', Validators.required],
      historyId: ['', Validators.required],
      specialistId: [this.specialistId, Validators.required],
      patientId: ['', Validators.required],
    });

    this.diagnosisId = parseInt(this.activatedRoute.snapshot.params['id']);

    if (this.diagnosisId > 0 && !isNaN(this.diagnosisId)) {
      this.diagnosisService.findById(this.diagnosisId).subscribe({
        next: (data: any) => {
          this.crudForm.patchValue({
            id: data.id,
            description: data.description,
            recommendations: data.recommendations,
            date: data.date ? new Date(data.date) : null,
            appointmentId: data.appointmentId,
            historyId: data.historyId,
            specialistId: data.specialistId,
            patientId: data.patientId,
          });
          
          
          this.tipoEspecialistaNombre = data.typeSpecialist?.name || '';

          if (data.patientId) {
            this.patientService.findById(data.patientId).subscribe({
              next: (patient: PatientDTO) => {
                this.pacienteSeleccionado = patient;
                
                this.loadHistoriesForPatient(patient.id);
              },
              error: (err) => console.error('Error al cargar paciente', err),
            });
          }
        },
        error: (err) => console.error('Error al cargar diagnóstico', err),
      });
    }
  }

  futureDateValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }
    
    const selectedDate = new Date(control.value);
    selectedDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      return { futureDate: true };
    }
    
    return null;
  }

  /**
   * Mapea el tipo de especialista al tipo de diagnóstico correspondiente
   * Ej: "Cardiólogo" -> "Cardiología"
   */
  private obtenerTipoDiagnostico(tipoEspecialista: string): string {
    if (!tipoEspecialista) return '';
    
    const mapeo: { [key: string]: string } = {
      'Cardiologo': 'Cardiologia',
      'Cardiólogo': 'Cardiología',
      'Neumologo': 'Neumologia',
      'Neumólogo': 'Neumología',
      'Nutricionista': 'Nutrición',
      'Somnologia': 'Somnologia',
      'Somnólogo': 'Somnología',
      'Dermatologia': 'Dermatologia',
      'Dermatologo': 'Dermatologia',
      'Oftalmologia': 'Oftalmologia',
      'Oftalmologo': 'Oftalmologia',
    };
    
    return mapeo[tipoEspecialista] || tipoEspecialista;
  }

  Grabar(): void {
    if (this.crudForm.invalid) {
      this.snack.open('Por favor completa todos los campos correctamente', 'OK', { duration: 3000 });
      return;
    }

    const diagnosis: DiagnosisDTO = {
      id: this.crudForm.get('id')?.value ? this.crudForm.get('id')?.value : 0,
      description: this.crudForm.get('description')?.value,
      type: this.tipoDiagnostico,
      recommendations: this.crudForm.get('recommendations')?.value,
      date: this.formatDateToYMD(this.crudForm.get('date')?.value),
      appointmentId: this.crudForm.get('appointmentId')?.value,
      historyId: this.crudForm.get('historyId')?.value,
      specialistId: this.specialistId,
      patientId: this.crudForm.get('patientId')?.value,
    };

    if (this.diagnosisId > 0) {
      this.diagnosisService.edit(diagnosis).subscribe({
        next: () => {
          this.snack.open('Diagnóstico actualizado correctamente', 'OK', { duration: 2000 });
          this.router.navigate(['/specialist/diagnosis-list']);
        },
        error: (http_error) => {
          this.snack.open('ERROR al actualizar: ' + http_error.message, 'OK', { duration: 5000 });
        },
      });
    } else {
      this.diagnosisService.new(diagnosis).subscribe({
        next: () => {
          this.snack.open('Diagnóstico registrado correctamente', 'OK', { duration: 2000 });
          this.router.navigate(['/specialist/diagnosis-list']);
        },
        error: (http_error) => {
          this.snack.open('ERROR al registrar: ' + http_error.message, 'OK', { duration: 5000 });
        },
      });
    }
  }

  formatDateToYMD(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  Cancelar(): void {
    this.router.navigate(['/specialist/diagnosis-list']);
  }

  onPatientChange(patientId: number): void {
    const patient = this.listaPatientes.find(p => p.id === patientId);
    this.pacienteSeleccionado = patient || null;
    
    this.loadHistoriesForPatient(patientId);
  }
}