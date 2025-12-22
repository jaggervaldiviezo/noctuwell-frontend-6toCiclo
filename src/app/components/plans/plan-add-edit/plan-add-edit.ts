import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanService } from '../../../services/plan-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanDTO } from '../../../models/planDTO';

@Component({
  selector: 'app-plan-add-edit',
  standalone: false,
  templateUrl: './plan-add-edit.html',
  styleUrls: ['./plan-add-edit.css'],
})
export class PlansAddEdit {
crudForm!: FormGroup;
  planId: number = 0;

  constructor(
    private planService: PlanService,
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
      price: ['', [Validators.required, Validators.min(0)]]
    });

    this.planId = parseInt(this.activatedRoute.snapshot.params['id']);

    if (this.planId > 0 && !isNaN(this.planId)) {
      
      this.planService.findById(this.planId).subscribe({
        next: (data: PlanDTO) => {
          
          this.crudForm.get("id")?.setValue(data.id);
          this.crudForm.get("name")?.setValue(data.name);
          this.crudForm.get("description")?.setValue(data.description);
          this.crudForm.get("price")?.setValue(data.price);
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
  Grabar() {
    
    const priceRaw = this.crudForm.get('price')?.value;
    const price = typeof priceRaw === 'string'
      ? Number(priceRaw.replace(',', '.'))
      : Number(priceRaw);

    const plan: PlanDTO = {
      id: this.crudForm.get("id")?.value ? this.crudForm.get("id")?.value : 0,
      name: this.crudForm.get("name")?.value,
      description: this.crudForm.get("description")?.value,
      price: isNaN(price) ? 0 : price
    };

    if (this.planId > 0) {
      this.planService.edit(plan).subscribe({
        next: (data) => {
          this.snack.open("Se actualizó el Plan correctamente", "OK", { duration: 2000 });
          this.router.navigate(["/plan-list"]);
        },
        error: (http_error) => {
          this.snack.open("ERROR al actualizar. " + http_error.message, "OK", { duration: 5000 });
          console.log(http_error);
        }
      });

    } else {
      this.planService.new(plan).subscribe({
        next: (data) => {
          this.snack.open("Se registró el nuevo Plan", "OK", { duration: 2000 });
          this.router.navigate(["/plan-list"]);
        },
        error: (http_error) => {
          this.snack.open("ERROR al registrar. " + http_error.message, "OK", { duration: 5000 });
          console.log(http_error);
        }
      });
    }
  }
}
