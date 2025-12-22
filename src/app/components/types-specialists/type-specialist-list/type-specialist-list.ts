import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TypeSpecialistDTO } from '../../../models/typeSpecialistDTO';
import { TypeSpecialistService } from '../../../services/type-specialist-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteConfirmation } from '../../confirmations/delete-confirmation/delete-confirmation';

@Component({
  selector: 'app-type-specialist-list',
  standalone: false,
  templateUrl: './type-specialist-list.html',
  styleUrl: './type-specialist-list.css',
})
export class TypeSpecialistList {
  dsTypesSpecialists = new MatTableDataSource<TypeSpecialistDTO>();
  displayedColumns: string[] = ['id', 'name', 'description', 'opciones'];

  constructor(
    private typeSpecialistService: TypeSpecialistService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.CargarLista();
  }

  CargarLista() {
    this.typeSpecialistService.listAll().subscribe({
      next: (data: TypeSpecialistDTO[]) => {
        this.dsTypesSpecialists = new MatTableDataSource(data);
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
        this.typeSpecialistService.delete(id).subscribe({
          next: () => {
            this.snack.open('Se eliminó el registro solicitado', 'OK', {
              duration: 2000,
            });
            this.CargarLista();
          },
          error: (http_error) => {
            this.snack.open(
              'ERROR: No se eliminó el registro solicitado. ' +
                http_error.error.message,
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
