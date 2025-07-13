import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { JobsComponent } from '../jobs/jobs.component';
import { JobsPageComponent } from '../jobs-page/jobs-page.component';
import { LoginComponent } from '../login/login.component';
import { DetailsComponent } from '../details/details.component';
import { AuthGuard } from '../../app/auth.guard';
import { Auth_Login } from '../../app/auth_login.gurd';
import { RedirectGuard } from '../../app/redirect-guard.guard';
import { TabelEmployeeComponent } from '../tabel-employee/tabel-employee.component';
import { AuthGuardManager } from '../../app/auth-guard-manager.guard';
import { AuthGuardJob } from '../../app/auth-guard-job.guard';

export const routes: Routes = [  { path: '',component:LoginComponent, canActivate: [RedirectGuard] },
    { path: 'פרטים-אישים', component: DetailsComponent, canActivate: [AuthGuard] }, // דף שדורש התחברות
    {path:'התחברות',component:LoginComponent,canActivate: [Auth_Login] },
      { path: 'ניהול-משרות', component: TabelEmployeeComponent, canActivate: [AuthGuardManager] },
  { path: 'משרות', component: JobsPageComponent , canActivate: [AuthGuardJob] },
    { path: '**', component:NotFoundComponent  }];
