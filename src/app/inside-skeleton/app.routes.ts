import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProfileComponent } from '../profile/profile.component';
import { PrescriptionComponent } from '../prescription/prescription.component';
import { SlotsComponent } from '../dashboard/slots/slots.component';
import { LifestyleComponent } from '../prescription/lifestyle/lifestyle.component';
import { ProblemListComponent } from '../prescription/problem-list/problem-list.component';
import { CompDeactiveService } from '../prescription/comp-deactive.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LifestyleActivateGuardService } from '../prescription/lifestyle/lifestyle-activate-guard.service';
import { ProblemListActivateGuardService } from '../prescription/problem-list/problem-list-activate-guard.service';
import { PrescribeComponent } from '../prescription/prescribe/prescribe.component';
import { PrescribeActivateGuardService } from '../prescription/prescribe/prescribe-activate-guard.service';
import { ReadOnlyPrescriptionComponent } from '../prescription/read-only-prescription/read-only-prescription.component';
import { PrescriptionHistoryComponent } from '../prescription-history/prescription-history.component';
import { FollowUpPrescriptionComponent } from '../prescription/follow-up-prescription/follow-up-prescription.component';
import { OnsultationComponent } from '../onsultation/onsultation.component';
import { PrescriptionGuardService } from '../prescription/prescription-guard.service';
import { WalletComponent } from '../wallet/wallet.component';

 
export const app_routes = [
	{path: 'dashboard', component: DashboardComponent, children:[
		{path:'slots/:id', component: SlotsComponent}
	]},
	{path:'profile', component: ProfileComponent},

	// for normal
	{path:'prescription', component: PrescriptionComponent, canActivate:[PrescriptionGuardService]},

	// for onsultation prescription link
	{path:'prescription/contact/:cell_no/:onsultation_id', component: PrescriptionComponent,
	canActivate:[PrescriptionGuardService]},

	// for normal ...
	{path:'prescription/vital-stat', component: LifestyleComponent, 
		canDeactivate:[CompDeactiveService], canActivate:[LifestyleActivateGuardService]}, 

	// for by navigating through button...step 1	
	{path:'prescription/vital-stat/:visit-status', component: LifestyleComponent, 
		canDeactivate:[CompDeactiveService]},

	// for normal ...	
	{path:'prescription/problem-list', component:ProblemListComponent, 
		canDeactivate:[CompDeactiveService], canActivate:[ProblemListActivateGuardService]},

	// for by navigating through button...step 2
	{path:'prescription/problem-list/:visit-status', component: ProblemListComponent, 
		canDeactivate:[CompDeactiveService]},	

	// for normal...	
	{path:'prescription/prescribe', component:PrescribeComponent,
		canDeactivate:[CompDeactiveService], canActivate:[PrescribeActivateGuardService]},

	// for by navigating through button...step 3
	{path:'prescription/prescribe/:visit-status', component:PrescribeComponent,
		canDeactivate:[CompDeactiveService]},	

	{path:'prescription/overall/:p_id/:editable', component: ReadOnlyPrescriptionComponent},	

	{path:'prescription/follow-up/:p_id/:update', component: FollowUpPrescriptionComponent, 
		canDeactivate:[CompDeactiveService]},

	{path:'prescription-history', component: PrescriptionHistoryComponent, 
	canActivate:[PrescriptionGuardService]},	

	{path:'change-password', component: ChangePasswordComponent},

	{path:'online-consultation', component: OnsultationComponent},

	{path:'online-consultation/1', component: OnsultationComponent},

	{path:'wallet', component: WalletComponent}	
];