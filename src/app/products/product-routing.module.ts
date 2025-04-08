import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AuthGuard } from '../auth/services/auth-guard/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
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
    path: 'add-product',
    component: AddProductComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
