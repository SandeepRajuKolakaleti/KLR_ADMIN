import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from '../auth/services/auth-guard/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [{
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }, {
        path: 'home',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      }]
      // }, {
      //   path: 'information',
      //   loadChildren: () => import('../information/information.module').then(m => m.InformationModule),
      // }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
