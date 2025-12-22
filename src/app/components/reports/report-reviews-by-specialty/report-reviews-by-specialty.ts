import { Component } from '@angular/core';
import { TypeSpecialistService } from '../../../services/type-specialist-service';
import { TypeSpecialistMostReviewsDTO } from '../../../models/TypeSpecialistMostReviewsDTO';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-report-reviews-by-specialty',
  standalone: false,
  templateUrl: './report-reviews-by-specialty.html',
  styleUrl: './report-reviews-by-specialty.css',
})
export class ReportReviewsBySpecialty {
  chartData: any[] = [];
  view: [number, number] = [700, 400];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Especialidades';
  showYAxisLabel = true;
  yAxisLabel = 'Total de Reseñas';

  colorScheme: Color = {
    name: 'reviewsScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3'] 
  };

  constructor(private typeSpecialistService: TypeSpecialistService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.typeSpecialistService.getReviewStatistics().subscribe({
      next: (data: TypeSpecialistMostReviewsDTO[]) => {
        this.chartData = data.map(item => ({
          name: item.name,
          value: item.totalReviews
        }));
      },
      error: (err) => console.error(err)
    });
  }
}
