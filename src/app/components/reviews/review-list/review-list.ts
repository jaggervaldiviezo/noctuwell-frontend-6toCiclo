import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { ReviewDTO } from '../../../models/reviewDTO';
import { SpecialistDTO } from '../../../models/specialistDTO';
import { TypeSpecialistDTO } from '../../../models/typeSpecialistDTO';

import { ReviewService } from '../../../services/review-service';
import { SpecialistService } from '../../../services/specialist-service';
import { TypeSpecialistService } from '../../../services/type-specialist-service';
import { UserService } from '../../../services/user-service';
import { DeleteConfirmation } from '../../confirmations/delete-confirmation/delete-confirmation';

@Component({
  selector: 'app-reviews-list',
  standalone: false,
  templateUrl: './review-list.html',
  styleUrl: './review-list.css',
})
export class ReviewsList {
  dsReviews = new MatTableDataSource<any>();
  todasLasReviews: any[] = [];

  typeSpecialists: TypeSpecialistDTO[] = [];
  specialists: SpecialistDTO[] = [];
  specialistsByType: SpecialistDTO[] = [];

  selectedTypeId: number | null = null;
  selectedSpecialistId: number | null = null;

  mode: 'patient' | 'specialist' | 'admin' = 'patient';

  constructor(
    private reviewService: ReviewService,
    private specialistService: SpecialistService,
    private typeSpecialistService: TypeSpecialistService,
    private userService: UserService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    const dataMode = this.route.snapshot.data['mode'] as
      | 'patient'
      | 'specialist'
      | undefined;
    console.log('dataMode desde ruta:', dataMode);
    console.log('isAdmin:', this.userService.isAdmin());
    console.log('isSpecialist:', this.userService.isSpecialist());
    console.log('isPatient:', this.userService.isPatient());

    if (dataMode) {
      this.mode = dataMode;
    } else {
      if (this.userService.isAdmin()) {
        this.mode = 'admin';
      } else if (this.userService.isSpecialist()) {
        this.mode = 'specialist';
      } else if (this.userService.isPatient()) {
        this.mode = 'patient';
      }
    }
    console.log('Mode final:', this.mode);

    this.CargarLista();
    this.CargarCombos();
  }

  CargarLista() {
    this.reviewService.listAll().subscribe({
      next: (data: ReviewDTO[]) => {
        this.todasLasReviews = data as any[];
        this.dsReviews = new MatTableDataSource(this.todasLasReviews);
      },
      error: (err) => console.log(err),
    });
  }

  CargarCombos() {
    this.typeSpecialistService.listAll().subscribe({
      next: (data) => (this.typeSpecialists = data),
      error: (err) => console.log(err),
    });

    this.specialistService.listAll().subscribe({
      next: (data) => (this.specialists = data),
      error: (err) => console.log(err),
    });
  }

  OnTypeChange() {
    this.selectedSpecialistId = null;

    if (!this.selectedTypeId) {
      this.specialistsByType = [];
      this.dsReviews.data = this.todasLasReviews;
      return;
    }

    const typeId = Number(this.selectedTypeId);

    this.specialistsByType = this.specialists.filter(
      (s) => Number(s.typeSpecialistId) === typeId
    );

    this.dsReviews.data = this.todasLasReviews.filter(
      (r) =>
        r.specialist &&
        r.specialist.typeSpecialist &&
        Number(r.specialist.typeSpecialist.id) === typeId
    );
  }

  OnSpecialistChange() {
    if (!this.selectedSpecialistId) {
      this.OnTypeChange();
      return;
    }

    const specId = Number(this.selectedSpecialistId);

    this.dsReviews.data = this.todasLasReviews.filter(
      (r) => r.specialist && Number(r.specialist.id) === specId
    );
  }

  Borrar(id: number) {
    const dialogReference = this.dialog.open(DeleteConfirmation);

    dialogReference.afterClosed().subscribe((opcion) => {
      if (opcion) {
        this.reviewService.delete(id).subscribe({
          next: () => {
            this.snack.open('Se eliminó la reseña correctamente', 'OK', {
              duration: 2000,
            });
            this.CargarLista();
          },
          error: (err) => {
            this.snack.open(
              'ERROR: No se pudo eliminar. ' + err.error?.message,
              'OK',
              { duration: 5000 }
            );
            console.log(err);
          },
        });
      }
    });
  }
}
