import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProductsComponent } from './components/products/products.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ProductService } from './services/product.service';



@NgModule({
  declarations: [ProductsComponent, AddProductComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule
  ],
  providers: [ProductService]
})
export class ProductsModule { }
