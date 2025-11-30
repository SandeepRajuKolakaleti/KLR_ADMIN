import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConstants } from 'src/app/app.constants';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.scss',
  standalone: false
})
export class AddUsersComponent {
  appConstants = AppConstants;
  userForm!: FormGroup;
  HighlightPosition = {};
  imgSrc: string | ArrayBuffer | null = 'assets/imgs/theme/upload.svg';
  editFlow: boolean = false;
  sub: any;
  user: any = {
    File: '',
    Name: '',
    Email: '',
    PhoneNumber: '',
    Address: '',
    TotalSales: '',
    Revenue: '',
    Status: ''
  };
  selectedFile: File | null = null;
  constructor(private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    private usersService: UsersService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.userForm = this.fb.group({
      File: ['', Validators.required],
      // ThmbnailImage: ['', Validators.required],
      Id: [''],
      Name: ['', Validators.required],
      Email: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
      Address: ['', Validators.required],
			Password: [ '', Validators.required],
      userRole: [{ value: AppConstants.userType.user}, Validators.required],
      permissionId: [{ value:AppConstants.permissionType.user}, Validators.required],
      Birthday: ['', Validators.required],
      TotalSales: ['', Validators.required],
      Revenue: ['', Validators.required],
      Status: ['', Validators.required],
    });
    this.sub = this.route.queryParams.subscribe(params => {
      if (params && params["data"]) {
        this.user = (JSON.parse(params["data"])).user || this.user;
        console.log('User:', this.user);
        if (this.user && this.user.id) {
          this.fillForm();
        }
      }
    });
  }

  fillForm() {
    this.editFlow = true;
    this.imgSrc = this.user.ThumnailImage || 'assets/imgs/theme/upload.svg';
    this.userForm.reset();
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.userForm.updateValueAndValidity();
    this.userForm.setErrors(null);
    this.userForm.patchValue({
      File: this.user.image || '',
      Id: this.user.id || '',
      Name: this.user.name || '',
      Email: this.user.email || '',
      PhoneNumber: this.user.phonenumber || '',
      Password: this.user.password || '',
      Address: this.user.address || '',
      TotalSales: this.user.totalSales || '',
      Revenue: this.user.revenue || '',
      Birthday: this.user.birthday || '',
      Status: this.user.status || '',
      userRole: this.user.userRole || '',
      permissionId: this.user.permissionId || ''
    });
    this.userForm.controls['File'].setValue(this.user.ThumnailImage || '');
    this.userForm.markAsDirty();
    this.userForm.markAsTouched();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      const file = input.files[0];
  
      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imgSrc = reader.result;
      };
      reader.readAsDataURL(file);
  
      // You can also store the file for uploading later
      this.selectedFile = file;
    }
  }

  save() {
    if (this.userForm.valid) {
      console.log('Vendor saved:', this.userForm.value);
      const formData = new FormData();
      formData.append('image', '');
      formData.append('name', this.userForm.controls['Name'].value);
      formData.append('email', this.userForm.controls['Email'].value);
      formData.append('phonenumber', this.userForm.controls['PhoneNumber'].value);
      formData.append('address', this.userForm.controls['Address'].value);
      //formData.append('status', this.vendorForm.controls['Status'].value);
      formData.append('password', this.userForm.controls['Password'].value);
      formData.append('birthday', this.userForm.controls['Birthday'].value);
      formData.append('userRole', this.userForm.controls['userRole'].value);
      formData.append('permissionId', this.userForm.controls['permissionId'].value);
      formData.append('revenue', this.userForm.controls['Revenue'].value);
      formData.append('totalSales', this.userForm.controls['TotalSales'].value);
      if (this.userForm.controls['File'].value) {
        formData.append('file', this.selectedFile as Blob);
      }
      this.usersService.create(formData).subscribe(
        (response: any) => {
          console.log('Vendor created successfully:', response);
          // Handle success, e.g., navigate to product list or show a success message
          this.snackBar.open('Vendor created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.userForm.reset();
          this.router.navigate(['vendors']);
        },
        (error: any) => {
          console.error('Error creating vendor:', error);
          // Handle error, e.g., show an error message
        }
      );
      // Reset the form after saving
      // this.vendorForm.reset();
      this.imgSrc = 'assets/imgs/theme/upload.svg'; // Reset image preview
      this.editFlow = false; // Reset edit flow
      this.userForm.markAsPristine();
      this.userForm.markAsUntouched();
      this.userForm.updateValueAndValidity();
      this.userForm.setErrors(null);
    } else {
      console.error('Form is invalid');
    }
  }

  edit() {
    console.log('Editing user:', this.userForm.value);
    if (this.userForm.valid) {
      const formData = new FormData();
      formData.append('image', '');
      formData.append('Id', this.userForm.controls['Id'].value.toString());
      formData.append('name', this.userForm.controls['Name'].value);
      formData.append('email', this.userForm.controls['Email'].value);
      formData.append('phonenumber', this.userForm.controls['PhoneNumber'].value);
      formData.append('address', this.userForm.controls['Address'].value);
      // formData.append('status', this.vendorForm.controls['Status'].value);
      formData.append('password', this.userForm.controls['Password'].value);
      formData.append('birthday', this.userForm.controls['Birthday'].value);
      formData.append('userRole', AppConstants.userType.vendor);
      formData.append('permissionId', AppConstants.permissionType.vendor);
      formData.append('revenue', this.userForm.controls['Revenue'].value);
      formData.append('totalSales', this.userForm.controls['TotalSales'].value);
      if (this.userForm.controls['File'].value) {
        formData.append('file', this.selectedFile as Blob);
      }
      this.usersService.update(formData).subscribe(
        (response: any) => {
          console.log('User updated successfully:', response);
          // Handle success, e.g., navigate to product list or show a success message
          this.snackBar.open('User updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.router.navigate(['users']);
          this.userForm.reset();
        },
        (error: any) => {
          console.error('Error updating user:', error);
          // Handle error, e.g., show an error message
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    } 
  }
}
