import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
    standalone: false
})
export class OrderDetailComponent implements OnInit {
 constructor(private router: Router, private route: ActivatedRoute) {}
 ngOnInit() {
  console.log(JSON.parse(this.route.snapshot.params['data']));
 }
}
