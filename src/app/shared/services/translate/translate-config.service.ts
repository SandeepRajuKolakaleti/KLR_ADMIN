import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from '../../../app.constants';
import { StorageService } from '../storage/storage.service';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

    languages: any = [];
    selectedlanguage: Subject<string> = new Subject<string>();
    selectedLanguage$ = this.selectedlanguage.asObservable();

    constructor(private translateService: TranslateService,
                private storageService: StorageService) {
        // Set default language
        this.translateService.setDefaultLang('en');

        // Get browser language (optional)
        const browserLang = this.translateService.getBrowserLang();
        this.translateService.use(browserLang?.match(/en|fr|es/) ? browserLang : 'en');
        translateService.addLangs(['en', 'fr']);
    }

    get getSelectedLanguage() {
        return this.selectedlanguage;
    }
    
    public setSelectedLanguage(value: string) {
        if (value) {
          this.selectedlanguage.next(value);
        } else {
            const language: any = this.translateService.getBrowserLang();
            this.selectedlanguage.next(language);
        }
        this.storageService.set('language', value);
        this.translateService.use(value);
    }

    getDefaultLanguage() {
        const language: any = this.translateService.getBrowserLang();
        this.translateService.setDefaultLang(language);
        return language;
    }

    setPrefferedLanguage() {
        const prefferedLanguage = this.storageService.get('language');
        this.translateService.addLangs([AppConstants.prefferedLanguages.en, AppConstants.prefferedLanguages.de]);
        // this.translateService.setDefaultLang(AppConstants.prefferedLanguages.en);
        this.languages = this.translateService.getLangs();
        if (prefferedLanguage && prefferedLanguage !== 'null') {
            this.setSelectedLanguage(prefferedLanguage);
        } else {
            const browserLang: any = this.translateService.getBrowserLang();
            const selectedLanguage = browserLang.match(/en|de/) ? browserLang : AppConstants.prefferedLanguages.en;
            this.setSelectedLanguage(selectedLanguage);
        }
    }

}
