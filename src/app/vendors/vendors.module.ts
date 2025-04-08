import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorsComponent } from './components/vendors/vendors.component';
import { VendorsRoutingModule } from './vendor-routing.module';
import { SharedModule } from '../shared/shared.module';
import { VendorDetailComponent } from './components/vendor-detail/vendor-detail.component';



@NgModule({
  declarations: [
    VendorsComponent,
    VendorDetailComponent
  ],
  imports: [
    CommonModule,
    VendorsRoutingModule,
    SharedModule
  ]
})
export class VendorsModule { }
