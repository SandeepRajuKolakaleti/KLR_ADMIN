import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  
  
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.getUserInformation();
  }

  getUserInformation() {
    this.authService.getUserInformation().subscribe((response)=> {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }

}
