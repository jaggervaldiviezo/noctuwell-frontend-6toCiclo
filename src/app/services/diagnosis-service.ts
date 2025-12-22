import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DiagnosisDTO } from '../models/diagnosisDTO';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class DiagnosisService {
  // La ruta del servidor se establece en /diagnoses
  private ruta_servidor: string = "http://localhost:8080/noctuwell/diagnoses"; 

  constructor(private http: HttpClient, private userService: UserService) { }

  
  listAll() {
    return this.http.get<DiagnosisDTO[]>(this.ruta_servidor);
  }

  // PACIENTE: sus propios diagnósticos
  listMyDiagnoses() {
    return this.http.get<DiagnosisDTO[]>(this.ruta_servidor + "/my");
  }

  // ESPECIALISTA: diagnósticos de sus pacientes
  listDiagnosesOfMyPatients() {
    return this.http.get<DiagnosisDTO[]>(this.ruta_servidor + "/my-patients");
  }


  findById(id: number) {
    return this.http.get<DiagnosisDTO>(this.ruta_servidor+"/"+id.toString());
  }
  
  findByPatientId(patientId: number) {
    return this.http.get<DiagnosisDTO[]>(this.ruta_servidor + "/patient/" + patientId.toString());
  }
  
  delete(id: number) {
    return this.http.delete(this.ruta_servidor+"/"+id.toString());
  }


 
  new(diagnosisDTO: DiagnosisDTO) {
    return this.http.post<DiagnosisDTO>(this.ruta_servidor, diagnosisDTO);
  }


  
  edit(diagnosisDTO: DiagnosisDTO) {
   
    return this.http.put<DiagnosisDTO>(this.ruta_servidor, diagnosisDTO);
  }
}