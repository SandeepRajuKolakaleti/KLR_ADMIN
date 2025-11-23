import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VendorService } from '../../services/vendor.service';

@Component({
    selector: 'app-vendor-detail',
    templateUrl: './vendor-detail.component.html',
    styleUrls: ['./vendor-detail.component.scss'],
    standalone: false
})
export class VendorDetailComponent implements OnInit {
  vendor: any;
  products: any[] = [];
  constructor(private route: ActivatedRoute, private vendorService: VendorService, ) {}
  ngOnInit(): void {
    console.log(JSON.parse(this.route.snapshot.params['id']));
    let id = this.route.snapshot.params['id'];
    this.vendorService.getVendorsById(id).subscribe((data: any) => {
      console.log('vendor fetched successfully:', data);
      this.vendor = data;
    }, (error: any) => {
      console.error('Error fetching products:', error);
      // Handle error appropriately, e.g., show a notification or alert
    });
    this.vendorService.getProductsById(id).subscribe((data: any) => {
      console.log('products fetched successfully:', data);
      this.products = data;
    }, (error: any) => {
      console.error('Error fetching products:', error);
      // Handle error appropriately, e.g., show a notification or alert
    });
  }

}
