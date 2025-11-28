import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../services/vendor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConstants } from 'src/app/app.constants';

@Component({
  selector: 'app-add-vendor', 
  templateUrl: './add-vendor.component.html',
  styleUrl: './add-vendor.component.scss',
  standalone: false
})
export class AddVendorComponent {
  vendorForm!: FormGroup;
  HighlightPosition = {};
  imgSrc: string | ArrayBuffer | null = 'assets/imgs/theme/upload.svg';
  editFlow: boolean = false;
  sub: any;
  vendor: any = {
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
    private vendorService:VendorService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.vendorForm = this.fb.group({
      File: ['', Validators.required],
      // ThmbnailImage: ['', Validators.required],
      Id: [''],
      Name: ['', Validators.required],
      Email: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
      Address: ['', Validators.required],
			Password: [ '', Validators.required],
      userRole: [{ value: AppConstants.userType.admin, disabled: true }, Validators.required],
      permissionId: [{ value:AppConstants.permissionType.vendor, disabled: true}, Validators.required],
      Birthday: ['', Validators.required],
      TotalSales: ['', Validators.required],
      Revenue: ['', Validators.required],
      Status: ['', Validators.required],
    });
    this.sub = this.route.queryParams.subscribe(params => {
      if (params && params["data"]) {
        this.vendor = (JSON.parse(params["data"])).vendor || this.vendor;
        console.log('Vendor:', this.vendor);
        if (this.vendor && this.vendor.id) {
          this.fillForm();
        }
      }
    });
  }

  fillForm() {
    this.editFlow = true;
    this.imgSrc = this.vendor.ThumnailImage || 'assets/imgs/theme/upload.svg';
    this.vendorForm.reset();
    this.vendorForm.markAsPristine();
    this.vendorForm.markAsUntouched();
    this.vendorForm.updateValueAndValidity();
    this.vendorForm.setErrors(null);
    this.vendorForm.patchValue({
      File: this.vendor.image || '',
      Id: this.vendor.id || '',
      Name: this.vendor.name || '',
      Email: this.vendor.email || '',
      PhoneNumber: this.vendor.phonenumber || '',
      Password: this.vendor.password || '',
      Address: this.vendor.address || '',
      TotalSales: this.vendor.totalSales || '',
      Revenue: this.vendor.revenue || '',
      Birthday: this.vendor.birthday || '',
      Status: this.vendor.status || '',
    });
    this.vendorForm.controls['File'].setValue(this.vendor.ThumnailImage || '');
    this.vendorForm.markAsDirty();
    this.vendorForm.markAsTouched();
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

  saveProduct() {
    if (this.vendorForm.valid) {
      console.log('Vendor saved:', this.vendorForm.value);
      const formData = new FormData();
      formData.append('image', '');
      formData.append('name', this.vendorForm.controls['Name'].value);
      formData.append('email', this.vendorForm.controls['Email'].value);
      formData.append('phonenumber', this.vendorForm.controls['PhoneNumber'].value);
      formData.append('address', this.vendorForm.controls['Address'].value);
      //formData.append('status', this.vendorForm.controls['Status'].value);
      formData.append('password', this.vendorForm.controls['Password'].value);
      formData.append('birthday', this.vendorForm.controls['Birthday'].value);
      formData.append('userRole', AppConstants.userType.vendor);
      formData.append('permissionId', AppConstants.permissionType.vendor);
      formData.append('revenue', this.vendorForm.controls['Revenue'].value);
      formData.append('totalSales', this.vendorForm.controls['TotalSales'].value);
      if (this.vendorForm.controls['File'].value) {
        formData.append('file', this.selectedFile as Blob);
      }
      this.vendorService.create(formData).subscribe(
        (response: any) => {
          console.log('Vendor created successfully:', response);
          // Handle success, e.g., navigate to product list or show a success message
          this.snackBar.open('Vendor created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.vendorForm.reset();
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
      this.vendorForm.markAsPristine();
      this.vendorForm.markAsUntouched();
      this.vendorForm.updateValueAndValidity();
      this.vendorForm.setErrors(null);
    } else {
      console.error('Form is invalid');
    }
  }

  editProduct() {
    console.log('Editing product:', this.vendorForm.value);
    if (this.vendorForm.valid) {
      const formData = new FormData();
      formData.append('image', '');
      formData.append('Id', this.vendorForm.controls['Id'].value.toString());
      formData.append('name', this.vendorForm.controls['Name'].value);
      formData.append('email', this.vendorForm.controls['Email'].value);
      formData.append('phonenumber', this.vendorForm.controls['PhoneNumber'].value);
      formData.append('address', this.vendorForm.controls['Address'].value);
      // formData.append('status', this.vendorForm.controls['Status'].value);
      formData.append('password', this.vendorForm.controls['Password'].value);
      formData.append('birthday', this.vendorForm.controls['Birthday'].value);
      formData.append('userRole', AppConstants.userType.vendor);
      formData.append('permissionId', AppConstants.permissionType.vendor);
      formData.append('revenue', this.vendorForm.controls['Revenue'].value);
      formData.append('totalSales', this.vendorForm.controls['TotalSales'].value);
      if (this.vendorForm.controls['File'].value) {
        formData.append('file', this.selectedFile as Blob);
      }
      this.vendorService.update(formData).subscribe(
        (response: any) => {
          console.log('Vendor updated successfully:', response);
          // Handle success, e.g., navigate to product list or show a success message
          this.snackBar.open('Vendor updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.router.navigate(['vendors']);
          this.vendorForm.reset();
        },
        (error: any) => {
          console.error('Error updating vendor:', error);
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
