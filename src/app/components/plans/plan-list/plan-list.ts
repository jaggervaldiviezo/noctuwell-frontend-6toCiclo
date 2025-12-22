import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PlanDTO } from '../../../models/planDTO';
import { PlanService } from '../../../services/plan-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteConfirmation } from '../../confirmations/delete-confirmation/delete-confirmation';

@Component({
  selector: 'app-plan-list',
  standalone: false,
  templateUrl: './plan-list.html',
  styleUrl: './plan-list.css',
})
export class PlansList {
  dsPlans=new MatTableDataSource<PlanDTO>();
  displayedColumns:string[]=['id','name','description','price','opciones'];

  constructor(private planService:PlanService, private dialog: MatDialog, private snack: MatSnackBar){}

  ngOnInit(){
    this.CargarLista();
  }

  CargarLista(){

    this.planService.listAll().subscribe({
      next: (data:PlanDTO[])=>{
        this.dsPlans=new MatTableDataSource(data);          
      },
      error: (err)=>{
          console.log(err);
      }      
    });  
  }
  
  Borrar(id:number){
    let dialogReference = this.dialog.open(DeleteConfirmation);

    dialogReference.afterClosed().subscribe(
      opcionSeleccionada=>{

        if(opcionSeleccionada) {
          this.planService.delete(id).subscribe({
            next:()=>{
                    this.snack.open("Se eliminó el registro solicitado","OK",{duration:2000});
                      this.CargarLista();
                    },
            error: (http_error)=>{
                    this.snack.open("ERROR: No se eliminó el registro solicitado. "+http_error.error.message,"OK",{duration:5000});
                    console.log(http_error);
            }   
          })
        }
      }
    );
    
  }

}
