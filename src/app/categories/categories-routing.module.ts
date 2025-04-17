import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { AuthGuard } from '../auth/services/auth-guard/auth-guard.service';
import { SubCategoriesComponent } from './components/sub-categories/sub-categories.component';
import { ChildCategoriesComponent } from './components/child-categories/child-categories.component';

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
  }, {
    path: 'sub-category',
    component: SubCategoriesComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'child-category',
    component: ChildCategoriesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
