import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from './modules/material-module/material-module-module';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { Login } from './components/login/login';
import { TypeSpecialistList } from './components/types-specialists/type-specialist-list/type-specialist-list';
import { DeleteConfirmation } from './components/confirmations/delete-confirmation/delete-confirmation';
import { Header } from './components/header/header';
import { Home } from './components/home/home';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { autorizacionInterceptor } from './interceptors/autorizacion-interceptor';
import { TypeSpecialistAddEdit } from './components/types-specialists/type-specialist-add-edit/type-specialist-add-edit';
import { SpecialistsList } from './components/specialists/specialists-list/specialists-list';
import { SpecialistsAddEdit } from './components/specialists/specialists-add-edit/specialists-add-edit';
import { PlansAddEdit } from './components/plans/plan-add-edit/plan-add-edit';
import { PlansList } from './components/plans/plan-list/plan-list';
import { PatientsAddEdit } from './components/patients/patient-add-edit/patient-add-edit';
import { PatientsList } from './components/patients/patient-list/patient-list';
import { HistoriesAddEdit } from './components/historia/history-add-edit/history-add-edit';
import { HistoriesList } from './components/historia/history-list/history-list';
import { ReviewsAddEdit } from './components/reviews/review-add-edit/review-add-edit';
import { ReviewsList } from './components/reviews/review-list/review-list';
import { ScheduleList } from './components/schedules/schedule-list/schedule-list';
import { ScheduleAddEdit } from './components/schedules/schedule-add-edit/schedule-add-edit';
import { DiagnosisAddEdit } from './components/diagnoses/diagnosis-add-edit/diagnosis-add-edit';
import { DiagnosisList } from './components/diagnoses/diagnosis-list/diagnosis-list';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportList } from './components/reports/report-list/report-list';
import { ReportMostUsedPlans } from './components/reports/report-most-used-plans/report-most-used-plans';
import { ReportAverageRating } from './components/reports/report-average-rating/report-average-rating';
import { ReportReviewsBySpecialty } from './components/reports/report-reviews-by-specialty/report-reviews-by-specialty';
import { ReportTopRated } from './components/reports/report-top-rated/report-top-rated';
import { ReportExperience } from './components/reports/report-experience/report-experience';
import { AppointmentAdd } from './components/appointment-add/appointment-add';
import { MatStepperModule } from '@angular/material/stepper';
import { AppointmentList } from './components/appointment-list/appointment-list';
import { Landingpage } from './components/landingpage/landingpage';
import { MessageList } from './components/message-list/message-list';
import { RegisterScreen } from './components/register-screen/register-screen';
@NgModule({
  declarations: [
    App,
    Login,
    TypeSpecialistList,
    DeleteConfirmation,
    Header,
    Home,
    TypeSpecialistAddEdit,
    SpecialistsList,
    SpecialistsAddEdit,
    PlansAddEdit,
    PlansList,
    PatientsAddEdit,
    PatientsList,
    HistoriesAddEdit,
    HistoriesList,
    ReviewsAddEdit,
    ReviewsList,
    ScheduleList,
    ScheduleAddEdit,
    DiagnosisAddEdit,
    DiagnosisList,
    ReportList,
    ReportMostUsedPlans,
    ReportAverageRating,
    ReportReviewsBySpecialty,
    ReportTopRated,
    ReportExperience,
    AppointmentAdd,
    AppointmentList,
    Landingpage,
    MessageList,
    RegisterScreen
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModuleModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([ autorizacionInterceptor ])
    )
  ],
  bootstrap: [App]
})
export class AppModule { }
