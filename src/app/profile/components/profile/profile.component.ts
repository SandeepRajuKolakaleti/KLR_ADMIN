import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { AuthService } from 'src/app/auth/services/auth/auth.service';

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
