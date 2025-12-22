import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeSpecialistDTO } from '../models/typeSpecialistDTO';
import { Observable } from 'rxjs';
import { TypeSpecialistAverageScoreDTO } from '../models/TypeSpecialistAverageScoreDTO';
import { TypeSpecialistMostReviewsDTO } from '../models/TypeSpecialistMostReviewsDTO';

@Injectable({
  providedIn: 'root',
})
export class TypeSpecialistService {
  ruta_servidor:string = "http://localhost:8080/noctuwell/typespecialists";
  constructor(private http:HttpClient){}

  listAll(){
    return this.http.get<TypeSpecialistDTO[]>(this.ruta_servidor);
  }

  findById(id: number){
    return this.http.get<TypeSpecialistDTO>(this.ruta_servidor+"/"+id.toString());
  }

  delete(id: number){
    return this.http.delete(this.ruta_servidor+"/"+id.toString());
  }

  new(typeSpecialistDTO: TypeSpecialistDTO){
    return this.http.post<TypeSpecialistDTO>(this.ruta_servidor,typeSpecialistDTO);
  }

  edit(typeSpecialistDTO: TypeSpecialistDTO){
    return this.http.put<TypeSpecialistDTO>(this.ruta_servidor+"/"+"update",typeSpecialistDTO);
  }
  getAverageRating(): Observable<TypeSpecialistAverageScoreDTO[]> {
    return this.http.get<TypeSpecialistAverageScoreDTO[]>(`${this.ruta_servidor}/average-rating`);
  }
  getReviewStatistics(): Observable<TypeSpecialistMostReviewsDTO[]> {
    return this.http.get<TypeSpecialistMostReviewsDTO[]>(`${this.ruta_servidor}/review-statistics`);
  }
}
