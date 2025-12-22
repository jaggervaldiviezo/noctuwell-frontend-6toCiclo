import { Component,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message-service';
import { Message } from '../../models/message';


@Component({
  selector: 'app-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList {
  messages: Message[] = [];
  mensajeTexto: string = "";
  appointmentId: number = 0;
  currentUser: string = "";
  
  
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id')); 
    
    
    this.currentUser = sessionStorage.getItem("username") || ""; 

    this.loadMessages();
  }

  
  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  loadMessages() {
    this.messageService.listByAppointment(this.appointmentId).subscribe(data => {
      this.messages = data;
      this.scrollToBottom();
    });
  }

  sendMessage() {
    if (this.mensajeTexto.trim().length === 0) return;

    
    let nuevoMensaje = new Message();
    nuevoMensaje.content = this.mensajeTexto;
    nuevoMensaje.appointmentId = this.appointmentId;
    
    

    this.messageService.insert(nuevoMensaje).subscribe({
      next: (msgRespuesta) => {
        
        this.messages.push(msgRespuesta);
        this.mensajeTexto = ""; 
      },
      error: (err) => {
        
        console.error(err);
        alert(err.error || "No se pudo enviar el mensaje."); 
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
