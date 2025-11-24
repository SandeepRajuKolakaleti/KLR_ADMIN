import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: false,
    animations: [
      trigger('tabAnimation', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        transition(':leave', [
          animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
        ])
      ])
    ]
  })
export class ProfileComponent {
  imgSrc: string | ArrayBuffer | null = 'assets/imgs/people/avatar-1.png';
  user: any = {};
  profileForm!: FormGroup;
  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getUserInformation();
  }

  getUserInformation() {
    this.profileForm = this.fb.group({
      Id: [''],
      File: [null, Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['', Validators.required],
      Address: ['', Validators.required],
      Birthday: ['', Validators.required],
    });
    this.authService.getUserInformation().subscribe((response)=> {
      console.log(response);
      this.user = response;
      this.fillProfile();
    }, (error) => {
      console.log(error);
    });
  }

  fillProfile() {
    this.profileForm.patchValue({
      Id: this.user.id,
      FirstName: this.user.name.split(' ')[0],
      LastName: this.user.name.split(' ')[1],
      Email: this.user.email,
      PhoneNumber: this.user.phonenumber,
      Address: this.user.address,
      Birthday: this.user.birthday,
      File: this.user.image
    });
    this.imgSrc = this.user.image;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.imgSrc = reader.result;
      reader.readAsDataURL(file);
      this.profileForm.patchValue({ File: file });
    }
  }

  save() {
    if (this.profileForm.valid) {
      const updatedData = {
        Id: this.profileForm.controls['Id'].value,
        name: this.profileForm.controls['FirstName'].value + ' ' + this.profileForm.controls['LastName'].value,
        email: this.profileForm.controls['Email'].value,
        phonenumber: this.profileForm.controls['PhoneNumber'].value,
        address: this.profileForm.controls['Address'].value,
        birthday: this.profileForm.controls['Birthday'].value,
        file: this.profileForm.controls['File'].value,
        image: this.user.image,
        permissionId: this.user.permissionId,
        permissionName: this.user.permissionName,
        userRole: this.user.userRole
      };
      console.log('Updated Profile Data:', updatedData);
      // Here you can call an API to save the updated profile data
      this.authService.updateUserApi(updatedData).subscribe((response) => {
        console.log('Profile updated successfully:', response);
        this.getUserInformation();
        this.snackBar.open('profile updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }, (error) => {
        console.log('Error updating profile:', error);
      });
    } else {
      console.log('Profile form is invalid');
    }
  }

}
