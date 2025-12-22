import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ScheduleDTO } from '../../../models/scheduleDTO';
import { ScheduleService } from '../../../services/schedule-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteConfirmation } from '../../confirmations/delete-confirmation/delete-confirmation';

@Component({
  selector: 'app-schedule-list',
  standalone: false,
  templateUrl: './schedule-list.html',
  styleUrl: './schedule-list.css',
})
export class ScheduleList {
  dsSchedule = new MatTableDataSource<ScheduleDTO>();

  displayedColumns: string[] = ['id', 'horaInicio', 'specialistId', 'acciones'];

  constructor(
    private scheduleService: ScheduleService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.CargarLista();
  }

  CargarLista() {
    this.scheduleService.listAll().subscribe({
      next: (data: ScheduleDTO[]) => {
        this.dsSchedule = new MatTableDataSource(data);
      },
      error: (err) => {
        console.error('Error al cargar la lista:', err);
      },
    });
  }

  Borrar(id: number) {
    let dialogRef = this.dialog.open(DeleteConfirmation);

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.scheduleService.delete(id).subscribe({
          next: () => {
            this.snack.open('Se eliminó el horario correctamente', 'OK', {
              duration: 2000,
            });
            this.CargarLista();
          },
          error: (err) => {
            this.snack.open('ERROR al eliminar. ' + err.error?.message, 'OK', {
              duration: 5000,
            });
            console.error(err);
          },
        });
      }
    });
  }
}
