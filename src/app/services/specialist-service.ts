import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpecialistDTO } from '../models/specialistDTO';
import { SpecialistRatingDTO } from '../models/SpecialistRatingDTO';
import { Observable } from 'rxjs';
import { SpecialistExperienceDTO } from '../models/SpecialistExperienceDTO';

@Injectable({
  providedIn: 'root',
})
export class SpecialistService {
  private ruta_servidor: string = "http://localhost:8080/noctuwell/specialists";
  constructor(private http: HttpClient) { }

  listAll() {
    return this.http.get<SpecialistDTO[]>(this.ruta_servidor);
  }
  
  findById(id: number) {
    return this.http.get<SpecialistDTO>(this.ruta_servidor + "/" + id.toString());
  }

  delete(id: number) {
    return this.http.delete(this.ruta_servidor + "/" + id.toString());
  }

  new(specialistDTO: SpecialistDTO) {
    return this.http.post<SpecialistDTO>(this.ruta_servidor, specialistDTO);
  }

  edit(specialistDTO: SpecialistDTO) {
    return this.http.put<SpecialistDTO>(this.ruta_servidor, specialistDTO);
  }

  getMyProfile() {
    return this.http.get<SpecialistDTO>(this.ruta_servidor + '/me');
  }

  getTopRatedSpecialists(): Observable<SpecialistRatingDTO[]> {
    return this.http.get<SpecialistRatingDTO[]>(`${this.ruta_servidor}/top-rated`);
  }
  getExperienceRanking(): Observable<SpecialistExperienceDTO[]> {
    return this.http.get<SpecialistExperienceDTO[]>(`${this.ruta_servidor}/experience-ranking`);
  }
}
