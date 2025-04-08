import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorsComponent } from './components/vendors/vendors.component';
import { AuthGuard } from '../auth/services/auth-guard/auth-guard.service';
import { VendorDetailComponent } from './components/vendor-detail/vendor-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }, {
    path: '',
    component: VendorsComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'vendor-detail',
    component: VendorDetailComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsRoutingModule { }
