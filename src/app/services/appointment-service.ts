import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentDTO } from '../models/appointmentDTO';
import { SlotDTO } from '../models/slotDTO';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Appointment } from '../models/appointment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private url = "http://localhost:8080/noctuwell/appointments";
  private urlAvailability = "http://localhost:8080/noctuwell/availability"; 

  constructor(private http: HttpClient) { }

  list(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.url);
  }

  insert(dto: AppointmentDTO): Observable<AppointmentDTO> {
    return this.http.post<AppointmentDTO>(this.url, dto);
  }

  checkAvailability(specialistId: number, date: string): Observable<SlotDTO[]> {
    let params = new HttpParams()
        .set('specialistId', specialistId)
        .set('date', date);
    
    return this.http.get<SlotDTO[]>(this.urlAvailability, { params });
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
