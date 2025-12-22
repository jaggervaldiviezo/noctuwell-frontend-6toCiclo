import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PatientDTO } from '../../../models/patientDTO';
import { DeleteConfirmation } from '../../confirmations/delete-confirmation/delete-confirmation';
import { PatientService } from '../../../services/patient-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patients-list',
  standalone: false,
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.css',
})
export class PatientsList {
  dsPatients = new MatTableDataSource<PatientDTO>();

  displayedColumns: string[] = ['id', 'fullName', 'gender', 'weight', 'height' ,'phone', 'birthDate', 'plan', 'opciones'];

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.CargarLista();
  }

  CargarLista() {
    this.patientService.listAll().subscribe({
      next: (data: PatientDTO[]) => {
        this.dsPatients = new MatTableDataSource(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  Borrar(id: number) {
    let dialogReference = this.dialog.open(DeleteConfirmation);

    dialogReference.afterClosed().subscribe(opcionSeleccionada => {
      if (opcionSeleccionada) {
        this.patientService.delete(id).subscribe({
          next: () => {
            this.snack.open("Se eliminó el paciente correctamente", "OK", { duration: 2000 });
            this.CargarLista();
          },
          error: (http_error) => {
            this.snack.open("ERROR: No se pudo eliminar. " + http_error.error?.message, "OK", { duration: 5000 });
            console.log(http_error);
          }
        });
      }
    });
  }
}
