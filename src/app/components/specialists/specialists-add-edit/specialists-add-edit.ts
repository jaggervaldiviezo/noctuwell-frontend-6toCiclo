import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeSpecialistDTO } from '../../../models/typeSpecialistDTO';
import { UserDTO } from '../../../models/userDTO';
import { SpecialistService } from '../../../services/specialist-service';
import { TypeSpecialistService } from '../../../services/type-specialist-service';
import { UserService } from '../../../services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecialistDTO } from '../../../models/specialistDTO';

@Component({
  selector: 'app-specialists-add-edit',
  standalone: false,
  templateUrl: './specialists-add-edit.html',
  styleUrls: ['./specialists-add-edit.css'],
})
export class SpecialistsAddEdit {
  crudForm!: FormGroup;
  specialistId: number = 0;
  listaTipos: TypeSpecialistDTO[] = [];
  listaUsuarios: UserDTO[] = [];
  listaUsuariosDisponibles: UserDTO[] = [];

  constructor(
    private specialistService: SpecialistService,
    private typeSpecialistService: TypeSpecialistService,
    private userService: UserService,
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
    this.userService.listAll().subscribe({
      next: (data: UserDTO[]) => {
        this.listaUsuarios = data;
        this.listaUsuariosDisponibles = data;

        const allUserIds: number[] = data.map((user) => user.id);

        console.log('IDs de todos los usuarios:', allUserIds);
      },
      error: (err) => console.error('Error al cargar usuarios', err),
    });

    this.typeSpecialistService.listAll().subscribe({
      next: (data: TypeSpecialistDTO[]) => {
        this.listaTipos = data;
      },
      error: (err) =>
        console.error('Error al cargar tipos de especialista', err),
    });
  }

  CargarFormulario() {
    this.crudForm = this.formBuilder.group({
      id: [''],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      certification: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      experience: [0, [Validators.required, Validators.min(0)]],
      userId: ['', Validators.required],
      typeSpecialistId: ['', Validators.required],
    });

    this.specialistId = parseInt(this.activatedRoute.snapshot.params['id']);

    if (this.specialistId > 0 && !isNaN(this.specialistId)) {
      this.specialistService.findById(this.specialistId).subscribe({
        next: (data: any) => {
          this.crudForm.patchValue({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            certification: data.certification,
            description: data.description,
            experience: data.experience,
            userId: data.user.id,
            typeSpecialistId: data.typeSpecialist.id,
          });
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  Grabar() {
    const specialist: SpecialistDTO = {
      id: this.crudForm.get('id')?.value ? this.crudForm.get('id')?.value : 0,
      firstName: this.crudForm.get('firstName')?.value,
      lastName: this.crudForm.get('lastName')?.value,
      phone: this.crudForm.get('phone')?.value,
      certification: this.crudForm.get('certification')?.value,
      description: this.crudForm.get('description')?.value,
      experience: this.crudForm.get('experience')?.value,
      userId: this.crudForm.get('userId')?.value,
      typeSpecialistId: this.crudForm.get('typeSpecialistId')?.value,
    };

    if (this.specialistId > 0) {
      this.specialistService.edit(specialist).subscribe({
        next: (data) => {
          this.snack.open('Se actualizó el Especialista correctamente', 'OK', {
            duration: 2000,
          });
          this.router.navigate(['/specialist-list']);
        },
        error: (http_error) => {
          this.snack.open('ERROR al actualizar: ' + http_error.message, 'OK', {
            duration: 5000,
          });
        },
      });
    } else {
      this.specialistService.new(specialist).subscribe({
        next: (data) => {
          this.snack.open('Se registró el nuevo Especialista', 'OK', {
            duration: 2000,
          });

          const nuevaLista = [];
          for (let i = 0; i < this.listaUsuariosDisponibles.length; i++) {
            if (this.listaUsuariosDisponibles[i].id !== specialist.userId) {
              nuevaLista.push(this.listaUsuariosDisponibles[i]);
            }
          }
          this.listaUsuariosDisponibles = nuevaLista;

          const usuarioSeleccionado = this.listaUsuarios.find(
            (u) => u.id === specialist.userId
          );

          if (usuarioSeleccionado) {
            this.userService
              .updateUserAuthority({
                username: usuarioSeleccionado.username,
                authorities: 'ROLE_SPECIALIST',
              })
              .subscribe({
                next: () => {
                  this.snack.open(
                    'Rol de usuario actualizado a ROLE_SPECIALIST',
                    'OK',
                    {
                      duration: 2000,
                    }
                  );
                },
                error: (http_error) => {
                  this.snack.open(
                    'ERROR al actualizar el rol: ' + http_error.message,
                    'OK',
                    {
                      duration: 5000,
                    }
                  );
                },
              });
          }

          this.router.navigate(['/specialist-list']);
        },
        error: (http_error) => {
          this.snack.open('ERROR al registrar: ' + http_error.message, 'OK', {
            duration: 5000,
          });
        },
      });
    }
  }
  onlyNumbers(event: KeyboardEvent): boolean {
    const key = event.key;

    const controlKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Enter',
    ];
    if (controlKeys.indexOf(key) !== -1) {
      return true;
    }

    if (key && key.length === 1) {
      if (/^[0-9]$/.test(key)) {
        return true;
      }
      event.preventDefault();
      return false;
    }

    return true;
  }
}
