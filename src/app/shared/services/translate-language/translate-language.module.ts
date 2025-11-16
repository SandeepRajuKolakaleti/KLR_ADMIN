import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { forkJoin, map } from 'rxjs';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export class MultiHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    return forkJoin([
      this.http.get(`/assets/i18n/common-${lang}.json`),
      this.http.get(`/assets/i18n/menu-${lang}.json`),
      this.http.get(`/assets/i18n/errors-${lang}.json`)
    ]).pipe(
      map(([common, menu, errors]) => { 
        console.log(common, menu, errors);
        return {...common, ...menu, ...errors}
      })
    );
  }
}

// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

@NgModule({ declarations: [],
  exports: [
      TranslateModule
  ], 
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useClass: MultiHttpLoader,
          deps: [HttpClient]
      }
  })], 
  providers: [provideHttpClient(withInterceptorsFromDi())] 
})
export class TranslateLanguageModule { }
