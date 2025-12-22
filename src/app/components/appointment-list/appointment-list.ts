import { Component } from '@angular/core';
import { Appointment } from '../../models/appointment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from '../../services/appointment-service';

@Component({
  selector: 'app-appointment-list',
  standalone: false,
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.css',
})
export class AppointmentList {
dsAppointments = new MatTableDataSource<Appointment>();
  
  displayedColumns: string[] = ['id', 'date', 'time', 'specialist', 'status', 'actions'];

  constructor(
    private appointmentService: AppointmentService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas() {
    this.appointmentService.list().subscribe({
      next: (data: Appointment[]) => {
        this.dsAppointments = new MatTableDataSource(data);
      },
      error: (err) => {
        console.error("Error al cargar citas:", err);
      }
    });
  }


  cancelarCita(id: number) {
    if(confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
        this.appointmentService.delete(id).subscribe({ 
            next: () => {
                this.snack.open("Cita eliminada/cancelada", "OK", { duration: 3000 });
                this.cargarCitas();
            },
            error: (err) => {
                this.snack.open("No se pudo cancelar la cita", "Error", { duration: 3000 });
            }
        });
    }
  }
}
