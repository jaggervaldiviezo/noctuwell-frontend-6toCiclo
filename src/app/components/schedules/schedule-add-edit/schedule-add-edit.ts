import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecialistDTO } from '../../../models/specialistDTO';
import { ScheduleService } from '../../../services/schedule-service';
import { SpecialistService } from '../../../services/specialist-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleDTO } from '../../../models/scheduleDTO';

@Component({
  selector: 'app-schedule-add-edit',
  standalone: false,
  templateUrl: './schedule-add-edit.html',
  styleUrl: './schedule-add-edit.css',
})
export class ScheduleAddEdit {
  crudForm!: FormGroup;
  scheduleId: number = 0;

  constructor(
    private scheduleService: ScheduleService,
    private formBuilder: FormBuilder,
    private snack: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.CargarFormulario();
  }

  CargarFormulario() {
    this.crudForm = this.formBuilder.group({
      id: [''],
      horaInicio: ['', [Validators.required]],
    });

    this.scheduleId = parseInt(this.activatedRoute.snapshot.params['id']);

    if (this.scheduleId > 0 && !isNaN(this.scheduleId)) {
      this.scheduleService.findById(this.scheduleId).subscribe({
        next: (data: any) => {
          this.crudForm.patchValue({
            id: data.id,
            horaInicio: data.horaInicio,
            specialistId: data.specialist
              ? data.specialist.id
              : data.specialistId,
          });
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  Grabar() {
    let horaRaw = this.crudForm.get('horaInicio')?.value;
    if (horaRaw && horaRaw.length === 5) {
      horaRaw = horaRaw + ':00';
    }

    const schedule: ScheduleDTO = {
      id: this.crudForm.get('id')?.value ? this.crudForm.get('id')?.value : 0,
      horaInicio: horaRaw,
      specialistId: 0,
    };

    if (this.scheduleId > 0) {
      this.scheduleService.update(schedule).subscribe({
        next: () => {
          this.snack.open('Se actualizó el horario correctamente', 'OK', {
            duration: 2000,
          });
          this.router.navigate(['/schedule-list']);
        },
        error: (err) => {
          this.snack.open('ERROR al actualizar: ' + err.message, 'OK', {
            duration: 5000,
          });
        },
      });
    } else {
      this.scheduleService.insert(schedule).subscribe({
        next: () => {
          this.snack.open('Se registró el horario correctamente', 'OK', {
            duration: 2000,
          });
          this.router.navigate(['/schedule-list']);
        },
        error: (err) => {
          this.snack.open('ERROR al registrar: ' + err.message, 'OK', {
            duration: 5000,
          });
        },
      });
    }
  }
}
