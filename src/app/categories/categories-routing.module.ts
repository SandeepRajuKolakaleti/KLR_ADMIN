import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { AuthGuard } from '../auth/services/auth-guard/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    canActivate: [AuthGuard]
    // children: [{
    //     path: '',
    //     redirectTo: 'home',
    //     pathMatch: 'full'
    //   }, {
    //     path: 'home',
    //     component: DashboardComponent,
    //   }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
