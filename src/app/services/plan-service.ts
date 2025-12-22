import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlanDTO } from '../models/planDTO';
import { TopPlanDTO } from '../models/TopPlanDTO';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  ruta_servidor:string = "http://localhost:8080/noctuwell/plans";
  constructor(private http:HttpClient){}

  listAll(){
    return this.http.get<PlanDTO[]>(this.ruta_servidor);
  }

  findById(id: number){
    return this.http.get<PlanDTO>(this.ruta_servidor+"/"+id.toString());
  }

  delete(id: number){
    return this.http.delete(this.ruta_servidor+"/"+id.toString());
  }

  new(PlanDTO: PlanDTO){
    return this.http.post<PlanDTO>(this.ruta_servidor,PlanDTO);
  }

  edit(PlanDTO: PlanDTO){
    return this.http.put<PlanDTO>(this.ruta_servidor+"/"+"update",PlanDTO); 
  }
  getMostUsedPlans(){
    return this.http.get<TopPlanDTO[]>(this.ruta_servidor+"/report/plan-statistics");
  }
}
