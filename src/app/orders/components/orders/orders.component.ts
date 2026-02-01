import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PeriodicElement } from '../../../products/components/products/products.component';
import { CommonBaseComponent } from '../../../shared/components/common-base/common-base.component';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { TranslateConfigService } from '../../../shared/services/translate/translate-config.service';
import { OrdersService } from '../../services/orders/orders.service';
import { AppConstants } from 'src/app/app.constants';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
    standalone: false
})
export class OrdersComponent extends CommonBaseComponent implements OnInit, AfterViewInit {
  ELEMENT_DATA = [];
  total: number = 0;
  displayedColumns: string[] = ['select', 'orderId', 'customer', 'date', 'amount', 'status', 'total', 'transactionId', 'actions'];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  };
  offset: number = 0;
  limit: number = 10;
  userRole: string = '';
  appConstants = AppConstants;
  constructor(private router: Router, private  translate: TranslateService,
    protected override storageService: StorageService, 
    protected override translateConfigService: TranslateConfigService,
    private ordersService: OrdersService
  ) {
      super(translateConfigService, translate, storageService);
      super.ngOnInit();
  }

  override ngOnInit() {

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.matPaginator;
    this.loadUserOrders(this.offset, this.limit);
  }

  loadUserOrders(offset: number, limit: number) {
    let ApiToken = this.storageService.get('ApiToken');
    this.userRole = ApiToken.user_permission;
    if (ApiToken.user_permission === AppConstants.userRole.admin) {
      this.ordersService.getUserOrders(offset, limit).subscribe((response: any) => {
        console.log(response);
        this.total = response.total;
        this.dataSource = new MatTableDataSource<any>(response.data);
        this.dataSource.paginator = this.matPaginator;
      });
    } else if (ApiToken.user_permission === AppConstants.userRole.vendor) {
      this.ordersService.getOrdersByVendorId(ApiToken.id).subscribe((response: any) => {
        console.log(response);
        this.total = response.total;
        this.dataSource = new MatTableDataSource<any>(response.data);
        this.dataSource.paginator = this.matPaginator;
      });
    } else if (ApiToken.user_permission === AppConstants.userRole.deliveryBoy) {
      this.ordersService.getOrdersByDeliveryBoyId(ApiToken.id).subscribe((response: any) => {
        console.log(response);
        this.total = response.total;
        this.dataSource = new MatTableDataSource<any>(response.data);
        this.dataSource.paginator = this.matPaginator;
      });
    }
  }

  pageChanged(event: any) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.loadUserOrders(this.offset, this.limit);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
        this.dataSource.paginator = this.matPaginator;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  view(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element);
    this.router.navigate(['orders/order-detail', { data: JSON.stringify(element)}]);
  }

  delete(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element)
  }
}
