import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SubCategoriesComponent } from './components/sub-categories/sub-categories.component';
import { ChildCategoriesComponent } from './components/child-categories/child-categories.component';



@NgModule({
  declarations: [
    CategoriesComponent,
    SubCategoriesComponent,
    ChildCategoriesComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule
  ]
})
export class CategoriesModule { }
