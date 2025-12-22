import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SpecialistDTO } from '../../../models/specialistDTO';
import { DeleteConfirmation } from '../../confirmations/delete-confirmation/delete-confirmation';
import { SpecialistService } from '../../../services/specialist-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-specialists-list',
  standalone: false,
  templateUrl: './specialists-list.html',
  styleUrl: './specialists-list.css',
})
export class SpecialistsList {
  dsSpecialists = new MatTableDataSource<SpecialistDTO>();

  displayedColumns: string[] = [
    'id',
    'fullName',
    'phone',
    'certification',
    'experience',
    'opciones',
  ];

  constructor(
    private specialistService: SpecialistService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.CargarLista();
  }

  CargarLista() {
    this.specialistService.listAll().subscribe({
      next: (data: SpecialistDTO[]) => {
        this.dsSpecialists = new MatTableDataSource(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  Borrar(id: number) {
    let dialogReference = this.dialog.open(DeleteConfirmation);

    dialogReference.afterClosed().subscribe((opcionSeleccionada) => {
      if (opcionSeleccionada) {
        this.specialistService.delete(id).subscribe({
          next: () => {
            this.snack.open('Se eliminó el especialista correctamente', 'OK', {
              duration: 2000,
            });
            this.CargarLista();
          },
          error: (http_error) => {
            this.snack.open(
              'ERROR: No se pudo eliminar. ' + http_error.error?.message,
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
