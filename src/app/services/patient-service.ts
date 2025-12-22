import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientDTO } from '../models/patientDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private ruta_servidor: string = "http://localhost:8080/noctuwell/patients";
  private url = "http://localhost:8080/noctuwell/patients";
  constructor(private http: HttpClient) { }

  listAll() {
    return this.http.get<PatientDTO[]>(this.ruta_servidor);
  }
  
  findById(id: number) {
    return this.http.get<PatientDTO>(this.ruta_servidor + "/" + id.toString());
  }

  delete(id: number) {
    return this.http.delete(this.ruta_servidor + "/" + id.toString());
  }

  new(patientDTO: PatientDTO) {
    return this.http.post<PatientDTO>(this.ruta_servidor, patientDTO);
  }

  edit(patientDTO: PatientDTO) {
    return this.http.put<PatientDTO>(this.ruta_servidor+"/update", patientDTO);
  }

  listMyPatients() {
  return this.http.get<PatientDTO[]>(this.ruta_servidor + "/my");
  }

  getPatientByUserId(userId: number): Observable<PatientDTO> {
    return this.http.get<PatientDTO>(`${this.url}/by-user/${userId}`);
  }
  
}
