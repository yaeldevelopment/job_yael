import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { JobsComponent } from '../jobs/jobs.component';
import { JobsPageComponent } from '../jobs-page/jobs-page.component';
import { LoginComponent } from '../login/login.component';
import { DetailsComponent } from '../details/details.component';
import { AuthGuard } from '../../app/auth.guard';

export const routes: Routes = [{path:"",component:JobsPageComponent},
    { path: 'פרטים-אישים', component: DetailsComponent, canActivate: [AuthGuard] }, // דף שדורש התחברות
    {path:'התחברות',component:LoginComponent}
    , { path: '**', component:NotFoundComponent  }];
