import { computed, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AbstractControl, FormArray, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppConstants } from '../../../app.constants';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  rightSideNavSubject: Subject<any> = new Subject<any>();
  rightSideNavSubject$ = this.rightSideNavSubject.asObservable();
  isUserAuthenticated = false;
  isLoggedIn = signal(false);
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private storageService: StorageService,
    private translateService: TranslateService,
    private snackbar: MatSnackBar) { }

  get isSignalLoggedIn () {
    return computed(() => this.isLoggedIn())
  }
  get isUserLoggedIn$() {
    return this.loggedIn.asObservable();
  }

  public isAuthenticated(): boolean {
    return this.isUserAuthenticated;
  }

  public setAuthenticated(value: boolean) {
    this.loggedIn.next(value);
    this.isUserAuthenticated = value;
    this.setUserSignal(value)
  }

  setUserSignal(value: boolean) {
    this.isLoggedIn.set(value);
  }

  loadScript(url: string) {
    const script = document.createElement('script');
    script.src = url;
    script.addEventListener('load', function () {
      // The script is loaded completely
    });
    document.head.appendChild(script);
  };

  loadScriptsInOrder (arrayOfJs: string[]) {
    arrayOfJs.map( (url) => {
      return this.loadScript(url);
    });
  };

  setRightSideNavToggle(value: any) {
    if (value) {
      this.rightSideNavSubject.next(value);
    }
  }

  convertStringToFloatNumber(value: string) {
    return parseFloat(value);
  }

  processFloatValuesToFixed(value: string) {
    let result: any;
    if(!value) {
      return undefined;
    }
    if (typeof value === 'string') {
      result = this.convertStringToFloatNumber(value);
    } else if (typeof value === 'number') {
      result = value;
    }
    return parseFloat(result.toFixed(2));
  }

  formatToYYYYMMDD(date: string) {
		return date.split('.')[2] + '-' + date.split('.')[1] + '-' + date.split('.')[0]
  }

  sendEmail(options: { Subject: any; Body: any; }) {
    let data = {
			Subject: options.Subject,
			Body: options.Body
		};
    // this.emailService.sendEmail(data).subscribe((response: any) => {
    //   // console.log('data:', response);
    //   if (response.status === 200) {
    //     this.snackbar.open(this.translateService.instant('MESSAGESENTSUCCESFULLY'), this.translateService.instant('CLOSE'), AppConstants.SNACK_BAR_DELAY);
    //   }
    // });
  }

  addKm(data: string) {
    return data + ' km';
  }

  addPercentage(data: string) {
    return data + ' %'
  }

  getDifferanceInDays(startDate: { toString: () => string | number | Date; }, endDate: { toString: () => string | number | Date; }) {
    const date1: any = new Date(startDate.toString());
    const date2: any = new Date(endDate.toString());
    const diffTime = Math.abs(date2 - date1) + 1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log('DiffDays:', diffDays);
    return diffDays;
  }

  validateNumberDecimal(): ValidatorFn {
    return (control: AbstractControl): any => {
      let valid = true;
      if (!control.value) {
        return null;
      }
      // console.log('Number value: ', control.value, typeof control.value);
      if (control.value) {
        // number only and 2 decimal accepted
        valid = /^[0-9]+([\.,][0-9]{1,2})?$/.test(control.value)? true: false;
      }
      return valid? null : { invalidNumber: true };
    };
  }

  validateEmail(): ValidatorFn {
    return (control: AbstractControl): any => {
      let valid = true;
      if (!control.value) {
        return null;
      }
      // console.log('Email value: ', control.value, typeof control.value);
      if (control.value) {
        // email accepted
        valid = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(control.value)? true: false;
      }
      return valid ? null: { invalidEmail: true };
    };
  }

  validateNumber(): ValidatorFn {
    return (control: AbstractControl): any  => {
      let valid = true;
      if (!control.value) {
        return null;
      }
      if (control.value) {
        // number only and 2 decimal accepted
        valid = /^[0-9]+?$/.test(control.value)? true: false;
      }
      return valid? null : { invalidNumber: true };
    }
  }

  validateThreeDigitsNumber(): ValidatorFn {
    return (control: AbstractControl): any  => {
      let valid = true;
      if (!control.value) {
        return null;
      }
      if (control.value) {
        // 3 digit number onlyaccepted
        valid = /^\d{3}$/.test(control.value)? true: false;
      }
      return valid? null : { invalidNumber: true };
    }
  }

  validateAlphabetNumericString(): ValidatorFn {
    return (control: AbstractControl): any => {
      let valid = true;
      if (!control.value) {
        return null;
      }
      if (control.value) {
        // alphanumberic with space or _,- are accepted
        valid = /^[a-zA-Z0-9äüößáéíóúÄÜÖÁÉÍÓÚ´]+([-_\s]{1}[a-zA-Z0-9äüößáéíóúÄÜÖÁÉÍÓÚ´]+)*$/.test(control.value)? true: false;
      }
      return valid? null : { invalid: true };
    }
  }

  validateAlphabetString(): ValidatorFn {
    return (control: AbstractControl): any => {
      let valid = true;
      if (!control.value) {
        return null;
      }
      if (control.value) {
        // number only and 2 decimal accepted
        valid = /^[a-zA-ZäüößáéíóúÄÜÖÁÉÍÓÚ´]*$/.test(control.value)? true: false;
      }
      return valid? null : { invalidAlphabets: true };
    }
  }

  validateTwoDigitIntegerString() {
    return (control: AbstractControl): any => {
      let valid = true;
      if (!control.value) {
        return null;
      }
      if (control.value) {
        // number only and 2 decimal accepted
        valid = /^\d{1,2}(\.\d{1,2})?$/.test(control.value)? true: false;
      }
      return valid? null : { invalid: true };
    }
  }

  validateTwoDigitIntegerHourString() {
    return (control: AbstractControl): any => {
      let valid = true;
      if (!control.value) {
        return null;
      }
      if (control.value) {
        // number only and 2 decimal accepted
        valid = control.value < 24 && control.value >= 0? true: false;
      }
      return valid? null : { invalidHour: true };
    }
  }

  validateTwoDigitIntegerMinuteString() {
    return (control: AbstractControl): any => {
      let valid = true;
      if (!control.value) {
        return null;
      }
      if (control.value) {
        // number only and 2 decimal accepted
        valid = control.value < 60 && control.value >= 0? true: false;
      }
      return valid? null : { invalidMinute: true };
    }
  }

  formateToGermanAddress(data: any) {
    let result;
    if (data) {
      if (data.name) {
        result = data.name;
      } 
      if (data.postalCode) {
        result = result + ',' + data.postalCode;
      } 
      if (data.locality && data.locality.long) {
        result = result + ',' + data.locality.long;
      }
      if (data.country && data.country.long) {
        result = result + ',' + data.country.long;
      }
    }
    return result;
  }

  removeLocalStorageValues() {
    let list = AppConstants.StorageValues;
    for (var i=0; i < list.length; i++) {
      localStorage.removeItem(list[i]);
    }
  }

  //check etension is CSV formate or not
  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv") || file.name.endsWith(".CSV");
  }

  getToJson(value: { toJSON: () => any; }) {
    return value.toJSON();
  }

  isAdminUser(userInfo: { UserRole: string; }) {
    return userInfo && userInfo.UserRole === 'Admin';
  }

  isMobileOrTabletView() {
		return window.innerWidth <= 1024;
	}

  filterDataByName(list: any[], value: any) {
    return list.filter((item) => {
      return item.Name.indexOf(value) > -1;
    });
  }

  filterDataByNameOrId(list: any[], value: any) {
    return list.filter((item) => {
      return item.Id.toString().indexOf(value) > -1 || item.Name.indexOf(value) > -1;
    });
  }

}
