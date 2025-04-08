import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';


export interface PeriodicElement {
  name: string;
  image: string;
  position: number;
  price: number;
  status: string;
  date: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  
  
  ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Hydrogen', price: 1.0079, status: 'H', date: '2-2-2020'},
    {position: 2, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Helium', price: 4.0026, status: 'He', date: '2-2-2020'},
    {position: 3, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Lithium', price: 6.941, status: 'Li', date: '2-2-2020'},
    {position: 4, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Beryllium', price: 9.0122, status: 'Be', date: '2-2-2020'},
    {position: 1, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Hydrogen', price: 1.0079, status: 'H', date: '2-2-2020'},
    {position: 2, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Helium', price: 4.0026, status: 'He', date: '2-2-2020'},
    {position: 3, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Lithium', price: 6.941, status: 'Li', date: '2-2-2020'},
    {position: 4, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Beryllium', price: 9.0122, status: 'Be', date: '2-2-2020'},
    {position: 1, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Hydrogen', price: 1.0079, status: 'H', date: '2-2-2020'},
    {position: 2, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Helium', price: 4.0026, status: 'He', date: '2-2-2020'},
    {position: 3, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Lithium', price: 6.941, status: 'Li', date: '2-2-2020'},
    {position: 4, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Beryllium', price: 9.0122, status: 'Be', date: '2-2-2020'},
  ];

  displayedColumns: string[] = ['select', 'position', 'image', 'name', 'price', 'status', 'date', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatPaginator) private paginator!: MatPaginator;

  constructor(private router: Router) {}

  ngOnInit() {

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

  edit(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element)
  }

  delete(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element)
  }

  createNewProduct() {
    console.log('product new');
    this.router.navigate(['products/add-product']);
  }
  
}
