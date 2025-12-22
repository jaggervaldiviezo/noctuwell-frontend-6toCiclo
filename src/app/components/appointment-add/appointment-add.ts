import { Component } from '@angular/core';
import { AppointmentDTO } from '../../models/appointmentDTO';
import { SlotDTO } from '../../models/slotDTO';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { SpecialistService } from '../../services/specialist-service';
import { AppointmentService } from '../../services/appointment-service';
import { SpecialistDTO } from '../../models/specialistDTO';
import { PatientDTO } from '../../models/patientDTO';
import { PatientService } from '../../services/patient-service';
@Component({
  selector: 'app-appointment-add',
  standalone: false,
  templateUrl: './appointment-add.html',
  styleUrl: './appointment-add.css',
  providers: [DatePipe]
})
export class AppointmentAdd {
firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  listaEspecialistas: SpecialistDTO[] = [];
  slotsDisponibles: SlotDTO[] = [];
  selectedSlot: SlotDTO | null = null;
  patientIdLogueado: number = 0;
  minDate: Date = new Date();
  constructor(
    private _formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private specialistService: SpecialistService,
    private userService: UserService,
    private router: Router,
    private snack: MatSnackBar,
    private datePipe: DatePipe,
    private patientService: PatientService
  ) {}
  ngOnInit() {
this.firstFormGroup = this._formBuilder.group({
      specialistId: ['', Validators.required],
      date: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      reason: ['', Validators.required]
    });
    this.specialistService.listAll().subscribe(data => {
        this.listaEspecialistas = data;
    });
    const userId = this.userService.getUserId();
    if (userId > 0) {
        this.patientService.getPatientByUserId(userId).subscribe({
            next: (patient: PatientDTO) => {
                this.patientIdLogueado = patient.id;
                console.log("Paciente identificado ID:", this.patientIdLogueado);
            },
            error: (err) => {
                console.error("Error paciente:", err);
                this.snack.open("Error: Usuario no registrado como paciente", "OK");
            }
        });
    }
  }
  buscarHorarios() {
    const specId = this.firstFormGroup.value.specialistId;
    const rawDate = this.firstFormGroup.value.date;
    if (specId && rawDate) {
      const dateString = this.datePipe.transform(rawDate, 'yyyy-MM-dd') || '';
      this.appointmentService.checkAvailability(specId, dateString).subscribe({
        next: (slots) => {
          this.slotsDisponibles = slots;
          this.selectedSlot = null;
        },
        error: (e) => console.error(e)
      });
    }
  }
  seleccionarHora(slot: SlotDTO) {
    if (slot.available) {
      this.selectedSlot = slot;
    }
  }
  reservar() {
    if (!this.selectedSlot) return;
    const rawDate = this.firstFormGroup.value.date;
    const dateString = this.datePipe.transform(rawDate, 'yyyy-MM-dd') || '';
    const newAppointment: AppointmentDTO = {
      id: 0,
      date: dateString,
      time: this.selectedSlot.time,
      reason: this.secondFormGroup.value.reason,
      status: 'AGENDADO',
      patientId: this.patientIdLogueado,
      specialistId: this.firstFormGroup.value.specialistId
    };
    this.appointmentService.insert(newAppointment).subscribe({
      next: () => {
        this.snack.open("¡Cita reservada con éxito!", "OK", { duration: 3000 });
        this.router.navigate(['/appointment-list']);
      },
      error: (err) => {
        this.snack.open("Error al reservar: " + err.error?.message, "Cerrar", { duration: 5000 });
      }
    });
  }
}
