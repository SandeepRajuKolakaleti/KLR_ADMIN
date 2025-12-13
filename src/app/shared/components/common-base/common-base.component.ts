import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../services/storage/storage.service';
import { TranslateConfigService } from '../../services/translate/translate-config.service';

@Component({
    selector: 'app-common-base',
    templateUrl: './common-base.component.html',
    styleUrls: ['./common-base.component.scss'],
    standalone: false
})
export class CommonBaseComponent implements OnInit {

  selectedLanguage: string | undefined;
  constructor(protected translateConfigService: TranslateConfigService,
    protected translateService: TranslateService,
    protected storageService: StorageService) { }

  ngOnInit(): void {
    let language = this.storageService.get('language');
    if (language) {
      this.translateService.use(language);
    } else {
      // Set default language
      this.translateService.setDefaultLang('en');
      // Get browser language (optional)
      const browserLang = this.translateService.getBrowserLang();
      this.translateService.use(browserLang?.match(/en|fr|es/) ? browserLang : 'en');
    }
    this.translateConfigService.selectedLanguage$.subscribe((value) => {
      console.log('from common base component: selectedLangauage', value);
      if (value) {
        this.selectedLanguage = value;
        this.translateService.use(value);
      }
    });
    this.translateConfigService.getSelectedLanguage.subscribe((value) => {
      // console.log('appcomponent language is:', res);
      if (value) {
        this.selectedLanguage = value;
        this.translateService.use(value);
      }
    });
  }

}
