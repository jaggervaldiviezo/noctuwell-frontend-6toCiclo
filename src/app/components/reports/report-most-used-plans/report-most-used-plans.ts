import { Component } from '@angular/core';
import { TopPlanDTO } from '../../../models/TopPlanDTO';
import { PlanService } from '../../../services/plan-service';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-report-most-used-plans',
  standalone: false,
  templateUrl: './report-most-used-plans.html',
  styleUrl: './report-most-used-plans.css',
})
export class ReportMostUsedPlans {
chartData: any[] = [];

  view: [number, number] = [700, 400];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Planes de Suscripción';
  showYAxisLabel = true;
  yAxisLabel = 'Total de Pacientes';

  colorScheme: Color = {
    name: 'noctuwellScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#2C0Ed8', '#5E35B1', '#039BE5', '#00ACC1', '#26A69A']
  };

  constructor(private planService: PlanService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.planService.getMostUsedPlans().subscribe({
      next: (data: TopPlanDTO[]) => {
        console.log("Datos recibidos:", data);
        
        this.chartData = data.map(item => ({
          name: item.planName,
          value: item.totalPatients
        }));
      },
      error: (err) => {
        console.error("Error cargando reporte:", err);
      }
    });
  }
}
