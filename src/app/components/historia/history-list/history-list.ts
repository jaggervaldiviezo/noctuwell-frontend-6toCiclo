import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { HistoryDTO } from '../../../models/historyDTO';
import { HistoryService } from '../../../services/history-service';
import { DeleteConfirmation } from '../../confirmations/delete-confirmation/delete-confirmation';

@Component({
  selector: 'app-histories-list',
  standalone: false,
  templateUrl: './history-list.html',
  styleUrl: './history-list.css',
})
export class HistoriesList {

  dsHistories = new MatTableDataSource<any>();

  displayedColumns: string[] = [];

  
  
  mode: 'patient' | 'specialist' | 'admin' = 'admin';

  constructor(
    private historyService: HistoryService,
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

    this.configurarColumnas();
    this.cargarLista();
  }

  configurarColumnas() {
    if (this.mode === 'patient') {
      
      
      this.displayedColumns = [
        'id',
        'background',
        'allergies',
        'medications',
        'typeSpecialist',
      ];
    } else {
      
      
      
      this.displayedColumns = [
        'id',
        'patient',
        'background',
        'allergies',
        'medications',
        'opciones',
      ];
    }
  }

  cargarLista() {
    if (this.mode === 'patient') {
      this.historyService.listMyHistories().subscribe({
        next: (data: HistoryDTO[]) => {
          this.dsHistories = new MatTableDataSource<any>(data as any);
        },
        error: (err) => console.log(err),
      });
    } else {
      this.historyService.listHistoriesOfMyPatients().subscribe({
        next: (data: HistoryDTO[]) => {
          this.dsHistories = new MatTableDataSource<any>(data as any);
        },
        error: (err) => console.log(err),
      });
    }
  }

  Borrar(id: number) {
    const dialogReference = this.dialog.open(DeleteConfirmation);

    dialogReference.afterClosed().subscribe((opcionSeleccionada) => {
      if (opcionSeleccionada) {
        this.historyService.delete(id).subscribe({
          next: () => {
            this.snack.open(
              'Se eliminó la historia correctamente',
              'OK',
              { duration: 2000 }
            );
            this.cargarLista();
          },
          error: (http_error) => {
            this.snack.open(
              'ERROR: No se pudo eliminar. ' + (http_error.error?.message || ''),
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
