import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit {

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
  }

}
