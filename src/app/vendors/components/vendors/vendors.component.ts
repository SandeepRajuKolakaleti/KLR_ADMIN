import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
    selector: 'app-vendors',
    templateUrl: './vendors.component.html',
    styleUrls: ['./vendors.component.scss'],
    standalone: false
})
export class VendorsComponent implements OnInit, AfterViewInit {
ELEMENT_DATA: any[] = [
    {position: 1, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'raju', email: "sandeep@test.com", status: 'H', date: '2-2-2020'},
    {position: 2, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'rani', email: "sandeep@test.com", status: 'He', date: '2-2-2020'},
    {position: 3, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'mukesh', email: "sandeep@test.com", status: 'Li', date: '2-2-2020'},
    {position: 4, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'nilesh',email: "sandeep@test.com", status: 'Be', date: '2-2-2020'},
    {position: 1, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'yeshwant', email: "sandeep@test.com", status: 'H', date: '2-2-2020'},
    {position: 2, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Helium', email: "sandeep@test.com", status: 'He', date: '2-2-2020'},
    {position: 3, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Lithium', email: "sandeep@test.com", status: 'Li', date: '2-2-2020'},
    {position: 4, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Beryllium', email: "sandeep@test.com", status: 'Be', date: '2-2-2020'},
    {position: 1, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Hydrogen', email: "sandeep@test.com", status: 'H', date: '2-2-2020'},
    {position: 2, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Helium', email: "sandeep@test.com", status: 'He', date: '2-2-2020'},
    {position: 3, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Lithium', email: "sandeep@test.com", status: 'Li', date: '2-2-2020'},
    {position: 4, image: 'https://tse1.mm.bing.net/th?id=OIP.S3ZNdZVENtccAG7Ys6ljdwHaEK&pid=Api&P=0&h=220', name: 'Beryllium', email: "sandeep@test.com", status: 'Be', date: '2-2-2020'},
  ];

  displayedColumns: string[] = ['select', 'position', 'image', 'name', 'email', 'status', 'date', 'action'];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
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
        this.dataSource.data.forEach((row: any) => this.selection.select(row));
        this.dataSource.paginator = this.paginator;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  view(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element);
    this.router.navigate(['vendors/vendor-detail', { data: JSON.stringify(element)}]);
  }

  delete(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element)
  }
}
