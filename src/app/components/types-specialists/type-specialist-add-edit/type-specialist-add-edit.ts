import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeSpecialistService } from '../../../services/type-specialist-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeSpecialistDTO } from '../../../models/typeSpecialistDTO';

@Component({
  selector: 'app-type-specialist-add-edit',
  standalone: false,
  templateUrl: './type-specialist-add-edit.html',
  styleUrl: './type-specialist-add-edit.css',
})
export class TypeSpecialistAddEdit {
  crudForm!: FormGroup;
  typeSpecialistId: number = 0;

  constructor(
    private typeSpecialistService: TypeSpecialistService,
    private formBuilder: FormBuilder,
    private snack: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.CargarFormulario();
  }

  CargarFormulario() {
    this.crudForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
    });

    this.typeSpecialistId = parseInt(this.activatedRoute.snapshot.params['id']);

    if (this.typeSpecialistId > 0 && !isNaN(this.typeSpecialistId)) {
      this.typeSpecialistService.findById(this.typeSpecialistId).subscribe({
        next: (data: TypeSpecialistDTO) => {
          this.crudForm.get('id')?.setValue(data.id);
          this.crudForm.get('name')?.setValue(data.name);
          this.crudForm.get('description')?.setValue(data.description);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
  Grabar() {
    const typeSpecialist: TypeSpecialistDTO = {
      id: this.crudForm.get('id')?.value ? this.crudForm.get('id')?.value : 0,
      name: this.crudForm.get('name')?.value,
      description: this.crudForm.get('description')?.value,
    };

    if (this.typeSpecialistId > 0) {
      this.typeSpecialistService.edit(typeSpecialist).subscribe({
        next: (data) => {
          this.snack.open(
            'Se actualizó el Tipo de Especialista correctamente',
            'OK',
            { duration: 2000 }
          );
          this.router.navigate(['/typeSpecialist-list']);
        },
        error: (http_error) => {
          this.snack.open('ERROR al actualizar. ' + http_error.message, 'OK', {
            duration: 5000,
          });
          console.log(http_error);
        },
      });
    } else {
      this.typeSpecialistService.new(typeSpecialist).subscribe({
        next: (data) => {
          this.snack.open('Se registró el nuevo Tipo de Especialista', 'OK', {
            duration: 2000,
          });
          this.router.navigate(['/typeSpecialist-list']);
        },
        error: (http_error) => {
          this.snack.open('ERROR al registrar. ' + http_error.message, 'OK', {
            duration: 5000,
          });
          console.log(http_error);
        },
      });
    }
  }
}
