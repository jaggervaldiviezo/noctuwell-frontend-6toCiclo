import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { ReviewService } from '../../../services/review-service';
import { SpecialistService } from '../../../services/specialist-service';

import { ReviewCreateDTO } from '../../../models/reviewCreateDTO';
import { SpecialistDTO } from '../../../models/specialistDTO';

@Component({
  selector: 'app-review-add-edit',
  standalone: false,
  templateUrl: './review-add-edit.html',
  styleUrl: './review-add-edit.css',
})
export class ReviewsAddEdit {
  crudForm!: FormGroup;
  reviewId: number = 0;
  listaEspecialistas: SpecialistDTO[] = [];

  constructor(
    private reviewService: ReviewService,
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
    this.specialistService.listAll().subscribe({
      next: (data: SpecialistDTO[]) => {
        this.listaEspecialistas = data;
      },
      error: (err) => console.log(err),
    });
  }

  CargarFormulario() {
    this.crudForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.minLength(5)]],
      calificacion: [
        5,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      specialistId: ['', Validators.required],
    });

    this.reviewId = parseInt(this.activatedRoute.snapshot.params['id']);

    if (this.reviewId > 0 && !isNaN(this.reviewId)) {
      this.reviewService.findById(this.reviewId).subscribe({
        next: (data: any) => {
          this.crudForm.patchValue({
            comment: data.comment,
            calificacion: data.calificacion,
            specialistId: data.specialist?.id || data.specialistId,
          });
        },
        error: (err) => console.error(err),
      });
    }
  }

  setRating(star: number) {
    this.crudForm.get('calificacion')?.setValue(star);
  }

  Grabar() {
    if (this.crudForm.invalid) {
      return;
    }

    const reviewCreateDTO: ReviewCreateDTO = {
      comment: this.crudForm.get('comment')?.value,
      calificacion: this.crudForm.get('calificacion')?.value,
      specialistId: this.crudForm.get('specialistId')?.value,
    };

    if (this.reviewId > 0) {
      this.reviewService.edit(reviewCreateDTO).subscribe({
        next: () => {
          this.snack.open('Se actualizó la Reseña correctamente', 'OK', {
            duration: 2000,
          });
          this.router.navigate(['/review-list']);
        },
        error: (http_error) => {
          this.snack.open('ERROR al actualizar: ' + http_error.message, 'OK', {
            duration: 5000,
          });
        },
      });
    } else {
      this.reviewService.addForMe(reviewCreateDTO).subscribe({
        next: () => {
          this.snack.open('Se registró la nueva Reseña', 'OK', {
            duration: 2000,
          });
          this.router.navigate(['/review-list']);
        },
        error: (http_error) => {
          this.snack.open('ERROR al registrar: ' + http_error.message, 'OK', {
            duration: 5000,
          });
        },
      });
    }
  }
}
