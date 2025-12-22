import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Landingpage } from './components/landingpage/landingpage';
import { Home } from './components/home/home';
import { TypeSpecialistList } from './components/types-specialists/type-specialist-list/type-specialist-list';
import { autorizarConsultaGuardGuard } from './guards/autorizar-consulta-guard';
import { TypeSpecialistAddEdit } from './components/types-specialists/type-specialist-add-edit/type-specialist-add-edit';
import { autorizarRegistroGuardGuard } from './guards/autorizar-registro-guard';
import { SpecialistsList } from './components/specialists/specialists-list/specialists-list';
import { SpecialistsAddEdit } from './components/specialists/specialists-add-edit/specialists-add-edit';
import { PlansList } from './components/plans/plan-list/plan-list';
import { PlansAddEdit } from './components/plans/plan-add-edit/plan-add-edit';
import { PatientsList} from './components/patients/patient-list/patient-list';
import { PatientsAddEdit } from './components/patients/patient-add-edit/patient-add-edit';
import { HistoriesList } from './components/historia/history-list/history-list';
import { HistoriesAddEdit } from './components/historia/history-add-edit/history-add-edit';
import { ReviewsAddEdit } from './components/reviews/review-add-edit/review-add-edit';
import { ReviewsList } from './components/reviews/review-list/review-list';
import { ScheduleList } from './components/schedules/schedule-list/schedule-list';
import { ScheduleAddEdit } from './components/schedules/schedule-add-edit/schedule-add-edit';
import { DiagnosisList } from './components/diagnoses/diagnosis-list/diagnosis-list';
import { DiagnosisAddEdit } from './components/diagnoses/diagnosis-add-edit/diagnosis-add-edit';
import { ReportList } from './components/reports/report-list/report-list';
import { ReportMostUsedPlans } from './components/reports/report-most-used-plans/report-most-used-plans';
import { ReportAverageRating } from './components/reports/report-average-rating/report-average-rating';
import { ReportReviewsBySpecialty } from './components/reports/report-reviews-by-specialty/report-reviews-by-specialty';
import { ReportTopRated } from './components/reports/report-top-rated/report-top-rated';
import { ReportExperience } from './components/reports/report-experience/report-experience';
import { AppointmentAdd } from './components/appointment-add/appointment-add';
import { AppointmentList } from './components/appointment-list/appointment-list';
import { MessageList } from './components/message-list/message-list';
import { esppacguard } from './guards/Autorizar-esp-pac-guard';
import { espGuard } from './guards/autorizar-esp';
import { espAdmguard } from './guards/Autorizar-espAdm-guard';
import { RegisterScreen } from './components/register-screen/register-screen';


const routes: Routes = [
  { path: "", component: Landingpage },
  { path: "login", component: Login },
     { path: "register", component: RegisterScreen },
  {path:"home", component:Home, canActivate:[autorizarConsultaGuardGuard]},

  {path:"typeSpecialist-list", component:TypeSpecialistList, canActivate:[autorizarRegistroGuardGuard]},
  { path: 'typeSpecialist-add', component: TypeSpecialistAddEdit, canActivate:[autorizarRegistroGuardGuard] },
  { path: 'typeSpecialist-edit/:id', component: TypeSpecialistAddEdit, canActivate:[autorizarRegistroGuardGuard] },

  {path:"specialist-list", component:SpecialistsList, canActivate:[autorizarRegistroGuardGuard]},
  { path: 'specialist-add', component: SpecialistsAddEdit, canActivate:[autorizarRegistroGuardGuard] },
  { path: 'specialist-edit/:id', component: SpecialistsAddEdit, canActivate:[autorizarRegistroGuardGuard] },

  {path:"plan-list", component:PlansList, canActivate:[autorizarConsultaGuardGuard]},
  { path: 'plan-add', component: PlansAddEdit, canActivate:[autorizarRegistroGuardGuard] },
  { path: 'plan-edit/:id', component: PlansAddEdit, canActivate:[autorizarRegistroGuardGuard] },

  {path:"patient-list", component:PatientsList, canActivate:[espAdmguard]},
  { path: 'patient-add', component: PatientsAddEdit, canActivate:[autorizarRegistroGuardGuard] },
  { path: 'patient-edit/:id', component: PatientsAddEdit, canActivate:[autorizarRegistroGuardGuard] },

  {path: 'patient/history-list', component: HistoriesList,canActivate: [esppacguard],data: { mode: 'patient' }},
{path: 'specialist/history-list', component: HistoriesList, canActivate: [esppacguard], data: { mode: 'specialist' }},
{ path: 'specialist/history-add', component: HistoriesAddEdit, canActivate: [esppacguard]},
{ path: 'specialist/history-edit/:id', component: HistoriesAddEdit,canActivate: [esppacguard]},

  { path: 'patient/diagnosis-list', component: DiagnosisList, canActivate: [esppacguard], data: { mode: 'patient' } },
  { path: 'specialist/diagnosis-list', component: DiagnosisList, canActivate: [esppacguard], data: { mode: 'specialist' } },
  { path: 'specialist/diagnosis-add', component: DiagnosisAddEdit, canActivate: [esppacguard] },
  { path: 'specialist/diagnosis-edit/:id', component: DiagnosisAddEdit, canActivate: [esppacguard] },

  {path:"review-list", component:ReviewsList, canActivate:[autorizarConsultaGuardGuard]},
  { path: 'review-add', component: ReviewsAddEdit, canActivate:[autorizarConsultaGuardGuard] },
  { path: 'review-edit/:id', component: ReviewsAddEdit, canActivate:[autorizarConsultaGuardGuard] },

  { path: 'schedule-list', component: ScheduleList, canActivate:[espGuard] },
  { path: 'schedule-add', component: ScheduleAddEdit, canActivate:[espGuard] },
  { path: 'schedule-edit/:id', component: ScheduleAddEdit, canActivate:[espGuard] },

  { path: 'report-list', component: ReportList, canActivate:[autorizarRegistroGuardGuard] },
  { path: 'report-most-used-plans', component: ReportMostUsedPlans, canActivate:[autorizarRegistroGuardGuard] },
  { path: 'report-average-rating', component: ReportAverageRating, canActivate:[autorizarRegistroGuardGuard] },
  { path: 'report-reviews-by-specialty', component: ReportReviewsBySpecialty, canActivate:[autorizarRegistroGuardGuard]},
  { path: 'report-top-rated', component: ReportTopRated, canActivate:[autorizarRegistroGuardGuard] },
  { path: 'report-experience', component: ReportExperience, canActivate:[autorizarRegistroGuardGuard] },

  { path: 'appointment-add', component: AppointmentAdd, canActivate: [esppacguard] },
  { path: 'appointment-list', component: AppointmentList, canActivate: [esppacguard] },

  { path: 'chat/:id', component: MessageList , canActivate: [esppacguard]},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
