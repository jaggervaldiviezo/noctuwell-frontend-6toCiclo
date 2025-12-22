import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { HistoryService } from '../../../services/history-service';
import { PatientService } from '../../../services/patient-service';

import { HistoryDTO } from '../../../models/historyDTO';
import { PatientDTO } from '../../../models/patientDTO';

import { SpecialistService } from '../../../services/specialist-service';
import { SpecialistDTO } from '../../../models/specialistDTO';

@Component({
  selector: 'app-histories-add-edit',
  standalone: false,
  templateUrl: './history-add-edit.html',
  styleUrl: './history-add-edit.css',
})
export class HistoriesAddEdit {

  crudForm!: FormGroup;
  historyId: number = 0;

  listaPacientes: PatientDTO[] = [];

  tipoEspecialistaNombre: string = '';

  constructor(
  private historyService: HistoryService,
  private patientService: PatientService,
  private specialistService: SpecialistService, 
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
    
    this.patientService.listMyPatients().subscribe({
      next: (data: PatientDTO[]) => {
        this.listaPacientes = data;
      },
      error: (err) => console.log(err)
    });
  }



  CargarFormulario() {
  this.crudForm = this.formBuilder.group({
    id: [''],
    background: ['', [Validators.required]],
    allergies: ['', [Validators.required]],
    medications: ['', [Validators.required]],
    patientId: ['', Validators.required],
    typeSpecialistId: [''], 
  });

  this.historyId = parseInt(this.activatedRoute.snapshot.params['id']);

  
  if (this.historyId > 0 && !isNaN(this.historyId)) {

    this.historyService.findById(this.historyId).subscribe({
      next: (data: any) => {
        this.crudForm.patchValue({
          id: data.id,
          background: data.background,
          allergies: data.allergies,
          medications: data.medications,
          patientId: data.patient.id,
          typeSpecialistId: data.typeSpecialist?.id
        });

        
        this.tipoEspecialistaNombre = data.typeSpecialist?.name || '';
      },
      error: (err) => console.error(err)
    });

  } else {
    
    this.specialistService.getMyProfile().subscribe({
      next: (esp: SpecialistDTO) => {
        this.crudForm.patchValue({
          typeSpecialistId: esp.typeSpecialistId 
        });
        this.tipoEspecialistaNombre = (esp as any).typeSpecialist?.name || '';
      },
      error: (err) => console.error(err)
    });
  }
}


  Grabar() {
    if (this.crudForm.invalid) {
      return;
    }

    const history: HistoryDTO = {
      id: this.crudForm.get('id')?.value ? this.crudForm.get('id')?.value : 0,
      background: this.crudForm.get('background')?.value,
      allergies: this.crudForm.get('allergies')?.value,
      medications: this.crudForm.get('medications')?.value,
      patientId: this.crudForm.get('patientId')?.value,
      
      
      typeSpecialistId: this.historyId > 0
        ? this.crudForm.get('typeSpecialistId')?.value
        : 0,
    };

    if (this.historyId > 0) {
      
      this.historyService.edit(history).subscribe({
        next: (data: any) => {
          
          this.tipoEspecialistaNombre = data.typeSpecialist?.name || '';

          this.snack.open(
            'Se actualizó la Historia correctamente. Tipo de especialista: ' + this.tipoEspecialistaNombre,
            'OK',
            { duration: 3000 }
          );

          
          this.router.navigate(['/specialist/history-list']);
        },
        error: (http_error) => {
          this.snack.open(
            'ERROR al actualizar: ' + (http_error.error?.message || http_error.message),
            'OK',
            { duration: 5000 }
          );
        }
      });
    } else {
      
      this.historyService.new(history).subscribe({
        next: (data: any) => {
          
          this.historyId = data.id; 
          this.crudForm.patchValue({
            id: data.id,
            typeSpecialistId: data.typeSpecialist?.id
          });
          this.tipoEspecialistaNombre = data.typeSpecialist?.name || '';

          this.snack.open(
            'Se registró la nueva Historia. Tipo de especialista: ' + this.tipoEspecialistaNombre,
            'OK',
            { duration: 3000 }
          );

          
          
          
          this.router.navigate(['/specialist/history-list']);
        },
        error: (http_error) => {
          this.snack.open(
            'ERROR al registrar: ' + (http_error.error?.message || http_error.message),
            'OK',
            { duration: 5000 }
          );
        }
      });
    }
  }

}
