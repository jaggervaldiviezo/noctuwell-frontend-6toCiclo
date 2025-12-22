import { Component } from '@angular/core';
import { SpecialistRatingDTO } from '../../../models/SpecialistRatingDTO';
import { SpecialistService } from '../../../services/specialist-service';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-report-top-rated',
  standalone: false,
  templateUrl: './report-top-rated.html',
  styleUrl: './report-top-rated.css',
})
export class ReportTopRated {
chartData: any[] = [];
  view: [number, number] = [700, 400];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Especialista';
  showYAxisLabel = true;
  yAxisLabel = 'Puntaje Promedio (0-5)';

  yAxisTickFormatting = (val: number) => val.toFixed(1);

  colorScheme: Color = {
    name: 'goldScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FFD700', '#FFA000', '#FF6F00', '#FF8F00', '#F57F17']
  };

  constructor(private specialistService: SpecialistService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.specialistService.getTopRatedSpecialists().subscribe({
      next: (data: SpecialistRatingDTO[]) => {
        this.chartData = data.map(item => ({
          name: item.specialistName,
          value: item.averageRating
        }));
      },
      error: (err) => console.error(err)
    });
  }
}
