import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from '../../../shared/services/translate/translate-config.service';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { CommonBaseComponent } from '../../../../app/shared/components/common-base/common-base.component';
import { AppConstants } from '../../../../app/app.constants';
import { environment } from '../../../../environments/environment';
declare let google: any;
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: false
})
export class RegisterComponent extends CommonBaseComponent implements OnInit {
  registerForm!: FormGroup;
  appConstants = AppConstants;
  imgSrc: string | ArrayBuffer | null = AppConstants.image.uploadDefault;
  constructor(private formBuilder: FormBuilder, 
    private authService: AuthService,
    private route: Router,
    private snackBar: MatSnackBar,
    protected override translateService: TranslateService,
    protected override translateConfigService: TranslateConfigService,
    protected override storageService: StorageService) {
      super(translateConfigService, translateService, storageService);
      super.ngOnInit();
     }

  override ngOnInit(): void {
    this.translateService.get('PASSWORDNOTEMPTY').subscribe((translated: string) => {
      console.log(translated);
      // You can call instant() here
      const translation = this.translateService.instant('PASSWORDNOTEMPTY');
      //=> 'Something else'
      console.log(translation);
    });
    this.createFormBuilder();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: environment.google.id, 
          callback: (response: any) => {
            console.log(response);
            this.handleGoogleLoginResponse(response)
          }
        });
        google.accounts.id.renderButton(
          document.getElementById("google-btn"),
          { theme: 'filled_blue',
            size: 'large',
            shape: 'rectangle',
            width: 200 
          });
      } else {
        console.error("Google Sign-In library not loaded.");
      }
    }, 1000);
  }

  decodeToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleGoogleLoginResponse(response: any) {
    if (response) {
      let payload = this.decodeToken(response.credential);
      this.storageService.set('userGoogleData', payload);
      this.authService.setAuthenticated(true);
      this.route.navigateByUrl("dashboard");
    }
  }

  createFormBuilder() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      File: [null, Validators.required],
      email: ['', Validators.required],
      phonenumber: ['', Validators.required],
      password: ['', Validators.required],
      userType: [AppConstants.userType.admin, Validators.required],
      address: ['', Validators.required],
      birthday: ['', Validators.required]
    });
  }

  login() {
    this.route.navigate(['login']);
  }

  submit() {
    if (this.registerForm.controls['password'].value === '') {
      this.snackBar.open(this.translateService.instant('PASSWORDNOTEMPTY'), this.translateService.instant('CLOSE'), AppConstants.SNACK_BAR_DELAY);
      return;
    }
    const options = {
      name: this.registerForm.controls['name'].value,
			email: this.registerForm.controls['email'].value,
			phonenumber: this.registerForm.controls['phonenumber'].value,
			password: this.registerForm.controls['password'].value,
      userRole: this.registerForm.controls['userType'].value,
      file: this.registerForm.controls['File'].value,
      permissionId: this.permission(),
      permissionName: this.registerForm.controls['userType'].value,
      address: this.registerForm.controls['address'] ? this.registerForm.controls['address'].value : '',
      birthday: this.registerForm.controls['birthday'] ? this.registerForm.controls['birthday'].value : ''
		}
    console.log(options);
    this.authService.registerApi(options).subscribe((response) => {
      // console.log('****** response: ', response);
      this.snackBar.open('profile registered successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
      this.route.navigate(['login']);
    }, (error) => {
      console.log('******error_loginCrApi******', error);
      this.snackBar.open(this.translateService.instant('INVALIDDETAILS'), this.translateService.instant('CLOSE'), AppConstants.SNACK_BAR_DELAY);
    });
  }

  permission() {
    const userType = this.registerForm.controls['userType'].value;
    if (userType === AppConstants.userType.admin) {
      return AppConstants.permissionType.admin;
    } else if (userType === AppConstants.userType.user) {
      return AppConstants.permissionType.user;
    } else if (userType === AppConstants.userType.vendor) {
      return AppConstants.permissionType.vendor;
    } else {
      return AppConstants.permissionType.deliveryBoy;
    }
  } 

   onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0] as Blob;
  
      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imgSrc = reader.result;
      };
      this.registerForm.controls['File'].patchValue(file);
      reader.readAsDataURL(file);
  
      // You can also store the file for uploading later
      // this.selectedFile = file;
    }
  }

}
