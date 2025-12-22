import { Component } from '@angular/core';
import { TypeSpecialistAverageScoreDTO } from '../../../models/TypeSpecialistAverageScoreDTO';
import { TypeSpecialistService } from '../../../services/type-specialist-service';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-report-average-rating',
  standalone: false,
  templateUrl: './report-average-rating.html',
  styleUrl: './report-average-rating.css',
})
export class ReportAverageRating {
chartData: any[] = [];
  view: [number, number] = [700, 400];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Especialidades';
  showYAxisLabel = true;
  yAxisLabel = 'Calificación Promedio (1-5)';
  
  yAxisTickFormatting = (val: number) => val.toFixed(1); 

  colorScheme: Color = {
    name: 'ratingScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FFC107', '#FF9800', '#4CAF50', '#2196F3', '#9C27B0']
  };

  constructor(private typeSpecialistService: TypeSpecialistService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.typeSpecialistService.getAverageRating().subscribe({
      next: (data: TypeSpecialistAverageScoreDTO[]) => {
        this.chartData = data.map(item => ({
          name: item.name,
          value: item.averageScore
        }));
      },
      error: (err) => console.error(err)
    });
  }
}
