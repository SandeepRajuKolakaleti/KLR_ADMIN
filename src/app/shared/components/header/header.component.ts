import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../app/auth/services/auth/auth.service';
import { TranslateConfigService } from '../../services/translate/translate-config.service';
import { CommonService } from '../../services/common/common.service';
declare let $: any;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit, AfterViewInit {

  isLoggedIn!: Observable<boolean>;
  constructor(public router: Router, private authService: AuthService, private translateConfigService: TranslateConfigService,private commonService: CommonService) { }

  ngOnInit(): void {
    // console.log('deviceInfo', this.deviceInfo);
    this.isLoggedIn = this.authService.isUserLoggedIn;
    this.authService.isUserLoggedIn.subscribe((data) => {
      console.log(data);
      this.commonService.loadScriptsInOrder([
        '/assets/js/vendors/jquery-3.6.0.min.js',
        '/assets/js/vendors/bootstrap.bundle.min.js',
        '/assets/js/vendors/select2.min.js',
        '/assets/js/vendors/perfect-scrollbar.js',
        '/assets/js/vendors/jquery.fullscreen.min.js',
        '/assets/js/vendors/chart.js',
        '/assets/js/main.js?v=1.1',
        'assets/js/custom-chart.js'
      ]);
    });
  }

  ngAfterViewInit() {
  }

  signIn() {
    console.log('signIn');
    this.router.navigate(['login']);
  }

  signout() {
    console.log('signout');
    this.authService.setAuthenticated(false);
    this.router.navigate(['login']);
  }

  changeLanguage(lang: string) {
    this.translateConfigService.setSelectedLanguage(lang);
  }

  route(value: string) {
    if (value === 'dashboard') {
      this.router.navigate(['dashboard'] );
    } else if (value === 'profile') {
      this.router.navigate(['profile'] );
    } else if (value === 'products') {
      this.router.navigate(['products'] );
    } else if (value === 'categories') {
      this.router.navigate(['categories'] );
    } else if (value === 'categories/sub-category') {
      this.router.navigate(['categories/sub-category'] );
    } else if (value === 'categories/child-category') {
      this.router.navigate(['categories/child-category'] );
    } else if (value === 'brands') {
      this.router.navigate(['categories/brands'] );
    } else if (value === 'orders') {
      this.router.navigate(['orders'] );
    } else if (value === 'vendors') {
      this.router.navigate(['vendors'] );
    }
  }

}
