import {RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {InsideSkeletonComponent} from './inside-skeleton/inside-skeleton.component';
import {InsideGuardService} from './inside-skeleton/inside-guard.service';
import {app_routes} from './inside-skeleton/app.routes';

export const Routing = RouterModule.forRoot([
	{path:'', component: LoginComponent},
	{path:'protected', redirectTo:'/protected/dashboard', pathMatch:'full'},
	{path:'protected', component:InsideSkeletonComponent, children:app_routes, 
	canActivate: [InsideGuardService]}
]);

