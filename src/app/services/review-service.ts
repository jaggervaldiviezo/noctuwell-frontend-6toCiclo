import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReviewCreateDTO } from '../models/reviewCreateDTO';
import { ReviewDTO } from '../models/reviewDTO';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private ruta_servidor: string = "http://localhost:8080/noctuwell/reviews";
  constructor(private http: HttpClient) { }

  listAll() {
    return this.http.get<ReviewDTO[]>(this.ruta_servidor);
  }
  
  findById(id: number) {
    return this.http.get<ReviewDTO>(this.ruta_servidor + "/" + id.toString());
  }

  delete(id: number) {
    return this.http.delete(this.ruta_servidor + "/" + id.toString());
  }

  new(reviewDTO: ReviewDTO) {
    return this.http.post<ReviewDTO>(this.ruta_servidor, reviewDTO);
  }

edit(reviewCreateDTO: ReviewCreateDTO) {
  return this.http.put<ReviewDTO>(this.ruta_servidor + "/update", reviewCreateDTO);
}

 addForMe(reviewCreateDTO: ReviewCreateDTO){
    return this.http.post<ReviewDTO>(this.ruta_servidor+"/me",reviewCreateDTO);
  }
}
