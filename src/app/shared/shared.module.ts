import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material/material.module';
import { TranslateLanguageModule } from './services/translate-language/translate-language.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonBaseComponent } from './components/common-base/common-base.component';
import { MatTableResponsiveDirective } from './directives/mat-table-responsive';
const declarations: any = [CommonBaseComponent, MatTableResponsiveDirective];
const modules = [
  CommonModule,
  MaterialModule,
  TranslateLanguageModule,
  TranslateModule,
  FormsModule,
  ReactiveFormsModule
];
@NgModule({
  declarations: declarations,
  imports: [modules],
  exports: [modules, declarations, MatTableResponsiveDirective],
  providers: []
})
export class SharedModule { }
