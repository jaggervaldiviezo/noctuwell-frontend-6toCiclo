import { Component } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { SpecialistService } from '../../../services/specialist-service';
import { SpecialistExperienceDTO } from '../../../models/SpecialistExperienceDTO';

@Component({
  selector: 'app-report-experience',
  standalone: false,
  templateUrl: './report-experience.html',
  styleUrl: './report-experience.css',
})
export class ReportExperience {
  chartData: any[] = [];
  view: [number, number] = [700, 400];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Especialista';
  showYAxisLabel = true;
  yAxisLabel = 'Años de Experiencia';

  colorScheme: Color = {
    name: 'experienceScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#009688', '#26A69A', '#4DB6AC', '#80CBC4', '#B2DFDB']
  };

  constructor(private specialistService: SpecialistService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.specialistService.getExperienceRanking().subscribe({
      next: (data: SpecialistExperienceDTO[]) => {
        this.chartData = data.map(item => ({
          name: item.specialistName,
          value: item.experience
        }));
      },
      error: (err) => console.error(err)
    });
  }
}
