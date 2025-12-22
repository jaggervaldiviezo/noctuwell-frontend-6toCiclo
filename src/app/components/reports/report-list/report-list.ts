import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-list',
  standalone: false,
  templateUrl: './report-list.html',
  styleUrl: './report-list.css',
})
export class ReportList {
  reports = [
    { 
      id: 3, 
      title: 'Experiencia del Staff', 
      description: 'Comparativa de años de experiencia entre especialistas.',
      icon: 'stars',
      route: '/report-experience'
    },
    { 
      id: 5, 
      title: 'Mejor Calificados', 
      description: 'Top de especialistas basado en reseñas de pacientes.',
      icon: 'thumb_up',
      route: '/report-top-rated'
    },
    { 
      id: 6, 
      title: 'Popularidad de Planes', 
      description: 'Distribución de suscripciones (Básico vs Premium).',
      icon: 'card_membership',
      route: '/report-most-used-plans'
    },
    { 
      id: 7, 
      title: 'Feedback por Área', 
      description: 'Volumen de comentarios recibidos por especialidad.',
      icon: 'forum',
      route: '/report-reviews-by-specialty'
    },
    { 
      id: 10, 
      title: 'Promedios Generales', 
      description: 'Métricas y promedios de calificación por especialidad.',
      icon: 'analytics',
      route: '/report-average-rating'
    }
  ];

  constructor(private router: Router) {}

  
  verReporte(ruta: string) {
    this.router.navigate([ruta]);
  }
}
