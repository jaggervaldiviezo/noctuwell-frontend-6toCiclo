import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private ruta_servidor: string = 'http://localhost:8080/noctuwell/messages';

  constructor(private http: HttpClient) { }

  listByAppointment(appointmentId: number) {
    return this.http.get<Message[]>(`${this.ruta_servidor}/appointment/${appointmentId}`);
  }

  insert(message: Message) {
    return this.http.post<Message>(this.ruta_servidor, message);
  }

  delete(id: number) {
    return this.http.delete(`${this.ruta_servidor}/${id}`);
  }
}
