import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PeriodicElement } from '../../../products/components/products/products.component';
import { CommonBaseComponent } from '../../../shared/components/common-base/common-base.component';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { TranslateConfigService } from 'src/app/shared/services/translate/translate-config.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
    standalone: false
})
export class OrdersComponent extends CommonBaseComponent implements OnInit, AfterViewInit {
ELEMENT_DATA = [
    {position: 1,  name: 'Hydrogen', email: 'sandeep@test.com', total: 1.0079, status: 'H', date: '2-2-2020'},
    {position: 2,  name: 'Helium', email: 'sandeep@test.com', total: 4.0026, status: 'He', date: '2-2-2020'},
    {position: 3,  name: 'Lithium', email: 'sandeep@test.com', total: 6.941, status: 'Li', date: '2-2-2020'},
    {position: 4,  name: 'Beryllium', email: 'sandeep@test.com', total: 9.0122, status: 'Be', date: '2-2-2020'},
    {position: 1,  name: 'Hydrogen', email: 'sandeep@test.com', total: 1.0079, status: 'H', date: '2-2-2020'},
    {position: 2,  name: 'Helium', email: 'sandeep@test.com', total: 4.0026, status: 'He', date: '2-2-2020'},
    {position: 3,  name: 'Lithium', email: 'sandeep@test.com', total: 6.941, status: 'Li', date: '2-2-2020'},
    {position: 4,  name: 'Beryllium', email: 'sandeep@test.com', total: 9.0122, status: 'Be', date: '2-2-2020'},
    {position: 1,  name: 'Hydrogen', email: 'sandeep@test.com', total: 1.0079, status: 'H', date: '2-2-2020'},
    {position: 2,  name: 'Helium', email: 'sandeep@test.com', total: 4.0026, status: 'He', date: '2-2-2020'},
    {position: 3,  name: 'Lithium', email: 'sandeep@test.com', total: 6.941, status: 'Li', date: '2-2-2020'},
    {position: 4,  name: 'Beryllium', email: 'sandeep@test.com', total: 9.0122, status: 'Be', date: '2-2-2020'},
  ];

  displayedColumns: string[] = ['select', 'position', 'name', 'email', 'total', 'date', 'status', 'action'];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) private paginator!: MatPaginator;

  constructor(private router: Router, private  translate: TranslateService,
    protected override storageService: StorageService, 
    protected override translateConfigService: TranslateConfigService,) {
      super(translateConfigService, translate, storageService);
      super.ngOnInit();
  }

  override ngOnInit() {

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
        this.dataSource.paginator = this.paginator;
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
