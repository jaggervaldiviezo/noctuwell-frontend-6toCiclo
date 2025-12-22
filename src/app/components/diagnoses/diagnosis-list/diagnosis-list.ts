import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { DiagnosisDTO } from '../../../models/diagnosisDTO';
import { PatientDTO } from '../../../models/patientDTO';
import { DiagnosisService } from '../../../services/diagnosis-service';
import { PatientService } from '../../../services/patient-service';
import { SpecialistService } from '../../../services/specialist-service';
import { DeleteConfirmation } from '../../confirmations/delete-confirmation/delete-confirmation';

@Component({
  selector: 'app-diagnosis-list',
  standalone: false,
  templateUrl: './diagnosis-list.html',
  styleUrl: './diagnosis-list.css',
})
export class DiagnosisList {
  dsDiagnoses = new MatTableDataSource<any>();

  displayedColumns: string[] = [];

  mode: 'patient' | 'specialist' | 'admin' = 'admin';

  constructor(
    private diagnosisService: DiagnosisService,
    private patientService: PatientService,
    private specialistService: SpecialistService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const dataMode = this.route.snapshot.data['mode'] as
      | 'patient'
      | 'specialist'
      | undefined;

    if (dataMode) {
      this.mode = dataMode;
    }

    console.log('Mode detectado:', this.mode);
    this.configurarColumnas();
    console.log('Columnas configuradas:', this.displayedColumns);
    this.cargarLista();
  }

  configurarColumnas() {
    if (this.mode === 'patient') {
      
      this.displayedColumns = [
        'id',
        'date',
        'type',
        'description',
        'recommendations',
        'specialist',
      ];
    } else {
      
      this.displayedColumns = [
        'id',
        'patient',
        'date',
        'type',
        'description',
        'opciones',
      ];
    }
  }

  cargarLista() {
    if (this.mode === 'patient') {
      this.diagnosisService.listMyDiagnoses().subscribe({
        next: (data: DiagnosisDTO[]) => {
          console.log('Datos diagnoses (patient):', data);
          
          data.forEach(diagnosis => {
            if (diagnosis.specialistId) {
              this.specialistService.findById(diagnosis.specialistId).subscribe({
                next: (specialist) => {
                  (diagnosis as any).specialist = specialist;
                  console.log('Especialista cargado:', specialist.firstName, specialist.lastName);
                  
                  this.dsDiagnoses.data = [...this.dsDiagnoses.data];
                },
                error: (err) => console.log('Error obteniendo especialista:', err)
              });
            }
          });
          this.dsDiagnoses = new MatTableDataSource<any>(data as any);
        },
        error: (err) => console.log('Error cargando diagnoses:', err),
      });
    } else {
      this.diagnosisService.listDiagnosesOfMyPatients().subscribe({
        next: (data: DiagnosisDTO[]) => {
          console.log('Datos diagnoses (specialist):', data);

          if (data.length === 0) {
            this.dsDiagnoses = new MatTableDataSource<any>([]);
            return;
          }

          
          const patientRequests = data
            .filter(d => d.patientId)
            .map(diagnosis =>
              this.patientService.findById(diagnosis.patientId).pipe(
                map((patient: PatientDTO) => {
                  (diagnosis as any).patientName = `${patient.firstName} ${patient.lastName}`;
                  return diagnosis;
                })
              )
            );

          if (patientRequests.length > 0) {
            forkJoin(patientRequests).subscribe({
              next: () => {
                this.dsDiagnoses = new MatTableDataSource<any>(data as any);
                console.log('Tabla actualizada con pacientes');
              },
              error: (err) => {
                console.error('Error cargando pacientes:', err);
                this.dsDiagnoses = new MatTableDataSource<any>(data as any);
              }
            });
          } else {
            this.dsDiagnoses = new MatTableDataSource<any>(data as any);
          }
        },
        error: (err) => {
          console.error('Error cargando diagnoses:', err);
          this.snack.open('Error al cargar diagnósticos', 'OK', { duration: 3000 });
        }
      });
    }
  }

  Borrar(id: number) {
    const dialogReference = this.dialog.open(DeleteConfirmation);

    dialogReference.afterClosed().subscribe((opcionSeleccionada) => {
      if (opcionSeleccionada) {
        this.diagnosisService.delete(id).subscribe({
          next: () => {
            this.snack.open('Se eliminó el diagnóstico correctamente', 'OK', {
              duration: 2000,
            });
            this.cargarLista();
          },
          error: (http_error) => {
            this.snack.open(
              'ERROR: No se pudo eliminar. ' +
                (http_error.error?.message || ''),
              'OK',
              { duration: 5000 }
            );
            console.log(http_error);
          },
        });
      }
    });
  }
}
