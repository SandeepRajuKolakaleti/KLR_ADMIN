import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorsComponent } from './components/vendors/vendors.component';
import { VendorsRoutingModule } from './vendor-routing.module';
import { SharedModule } from '../shared/shared.module';
import { VendorDetailComponent } from './components/vendor-detail/vendor-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddVendorComponent } from './components/add-vendor/add-vendor.component';



@NgModule({
  declarations: [
    VendorsComponent,
    VendorDetailComponent,
    AddVendorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VendorsRoutingModule,
    SharedModule,
  ]
})
export class VendorsModule { }
