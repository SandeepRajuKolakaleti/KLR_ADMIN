import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../services/vendor.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      TotalSales: ['', Validators.required],
      Revenue: ['', Validators.required],
      Status: ['', Validators.required],
    });
    this.sub = this.route.queryParams.subscribe(params => {
      if (params && params["data"]) {
        this.vendor = (JSON.parse(params["data"])).vendor || this.vendor;
        console.log('Vendor:', this.vendor);
        if (this.vendor && this.vendor.Id) {
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
      File: this.vendor.ThumnailImage || '',
      ...this.vendor,
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
      formData.append('ThumnailImage', '');
      formData.append('Name', this.vendorForm.controls['Name'].value);
      formData.append('Email', this.vendorForm.controls['Email'].value);
      formData.append('PhoneNumber', this.vendorForm.controls['PhoneNumber'].value);
      formData.append('Address', this.vendorForm.controls['Address'].value);
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
          this.router.navigate(['vendors']);
        },
        (error: any) => {
          console.error('Error creating vendor:', error);
          // Handle error, e.g., show an error message
        }
      );
      // Reset the form after saving
      this.vendorForm.reset();
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
      formData.append('ThumnailImage', '');
      formData.append('Id', this.vendorForm.controls['Id'].value);
      formData.append('Name', this.vendorForm.controls['Name'].value);
      formData.append('Email', this.vendorForm.controls['Email'].value);
      formData.append('PhoneNumber', this.vendorForm.controls['PhoneNumber'].value);
      formData.append('Address', this.vendorForm.controls['Address'].value);
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
