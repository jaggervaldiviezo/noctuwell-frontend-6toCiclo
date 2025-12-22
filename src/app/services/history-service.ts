import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HistoryDTO } from '../models/historyDTO';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private ruta_servidor: string = 'http://localhost:8080/noctuwell/histories';

  constructor(private http: HttpClient) {}

  // ADMIN 
  listAll() {
    return this.http.get<HistoryDTO[]>(this.ruta_servidor);
  }

  // PACIENTE sus propias historias
  listMyHistories() {
    return this.http.get<HistoryDTO[]>(this.ruta_servidor + "/my");
  }

  // ESPECIALISTA  historias de sus pacientes
  listHistoriesOfMyPatients() {
    return this.http.get<HistoryDTO[]>(this.ruta_servidor+"/my-patients");
  }

  // ESPECIALISTA - historias de un paciente específico filtradas por su tipo de especialista
  getHistoriesByPatientForLoggedSpecialist(patientId: number) {
    return this.http.get<HistoryDTO[]>(this.ruta_servidor + "/patient/" + patientId + "/for-me");
  }

  findById(id: number) {
    return this.http.get<HistoryDTO>(this.ruta_servidor+"/"+id.toString());
  }

  delete(id: number) {
    return this.http.delete(`${this.ruta_servidor}/${id}`);
  }

  new(historyDTO: HistoryDTO) {
    return this.http.post<HistoryDTO>(this.ruta_servidor, historyDTO);
  }

  edit(historyDTO: HistoryDTO) {
    return this.http.put<HistoryDTO>(this.ruta_servidor, historyDTO);
  }
}
