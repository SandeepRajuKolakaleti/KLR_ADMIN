import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorsComponent } from './components/vendors/vendors.component';
import { AuthGuard } from '../auth/services/auth-guard/auth-guard.service';
import { VendorDetailComponent } from './components/vendor-detail/vendor-detail.component';
import { AddVendorComponent } from './components/add-vendor/add-vendor.component';

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
    path: 'vendor-detail/:id',
    component: VendorDetailComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'add-vendor',
    component: AddVendorComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsRoutingModule { }
