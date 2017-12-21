import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routing } from './app.routing';

import { CommonService } from './common.service';
import { ValidationService } from './login/validation.service';
import { InsideGuardService } from './inside-skeleton/inside-guard.service';
import { DashboardService } from './dashboard/dashboard.service';
import { PrescriptionService } from './prescription/prescription.service';
import { CompDeactiveService } from './prescription/comp-deactive.service';
import { LifestyleActivateGuardService } from './prescription/lifestyle/lifestyle-activate-guard.service';
import { ProblemListActivateGuardService } from './prescription/problem-list/problem-list-activate-guard.service'; 
import { PrescribeActivateGuardService } from './prescription/prescribe/prescribe-activate-guard.service';
import { FollowUpPrescriptionService } from './prescription/follow-up-prescription.service';
import { OnsultationService } from './onsultation/onsultation.service';
import { PrescriptionGuardService } from './prescription/prescription-guard.service';
import { ChangePasswordService } from './inside-skeleton/change-password/change-password.service';
import { WalletService } from './wallet/wallet.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { InsideSkeletonComponent } from './inside-skeleton/inside-skeleton.component';
import { DropdownDirective } from './inside-skeleton/dropdown.directive';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { SlotsComponent } from './dashboard/slots/slots.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { LifestyleComponent } from './prescription/lifestyle/lifestyle.component';
import { ChangePasswordComponent } from './inside-skeleton/change-password/change-password.component';
import { ProblemListComponent } from './prescription/problem-list/problem-list.component';
import { PrescribeComponent } from './prescription/prescribe/prescribe.component';
import { ReadOnlyPrescriptionComponent } from './prescription/read-only-prescription/read-only-prescription.component';
import { PrescriptionHistoryComponent } from './prescription-history/prescription-history.component';
import { FollowUpPrescriptionComponent } from './prescription/follow-up-prescription/follow-up-prescription.component';
import { GeneralExamComponent } from './prescription/problem-list/general-exam/general-exam.component';
import { TextareaAnimationDirective } from './textarea-animation.directive';
import { PrintPrescriptionComponent } from './prescription/read-only-prescription/print-prescription/print-prescription.component';
import { OnsultationComponent } from './onsultation/onsultation.component';
import { WalletComponent } from './wallet/wallet.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    InsideSkeletonComponent,
    DropdownDirective,
    MenuComponent,
    DashboardComponent,
    ProfileComponent,
    PrescriptionComponent,
    SlotsComponent,
    DatepickerComponent,
    LifestyleComponent,
    ChangePasswordComponent,
    ProblemListComponent,
    PrescribeComponent,
    ReadOnlyPrescriptionComponent,
    PrescriptionHistoryComponent,
    FollowUpPrescriptionComponent,
    GeneralExamComponent,
    TextareaAnimationDirective,
    PrintPrescriptionComponent,
    OnsultationComponent,
    WalletComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Routing
  ],
  providers: [
    CommonService,
    ValidationService,
    InsideGuardService,
    DashboardService,
    PrescriptionService,
    CompDeactiveService,
    LifestyleActivateGuardService,
    ProblemListActivateGuardService,
    PrescribeActivateGuardService,
    FollowUpPrescriptionService,
    OnsultationService,
    PrescriptionGuardService,
    ChangePasswordService,
    WalletService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
