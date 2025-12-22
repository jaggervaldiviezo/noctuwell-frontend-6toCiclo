import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScheduleDTO } from '../models/scheduleDTO';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private ruta_servidor: string = "http://localhost:8080/noctuwell/schedules";
  constructor(private http: HttpClient) { }

  listAll() {
    return this.http.get<ScheduleDTO[]>(this.ruta_servidor);
  }

  findById(id: number) {
    return this.http.get<ScheduleDTO>(`${this.ruta_servidor}/${id}`);
  }

  insert(scheduleDTO: ScheduleDTO) {
    return this.http.post<ScheduleDTO>(this.ruta_servidor, scheduleDTO);
  }

  update(scheduleDTO: ScheduleDTO) {
    return this.http.put<ScheduleDTO>(this.ruta_servidor, scheduleDTO);
  }

  delete(id: number) {
    return this.http.delete(`${this.ruta_servidor}/${id}`);
  }
}
