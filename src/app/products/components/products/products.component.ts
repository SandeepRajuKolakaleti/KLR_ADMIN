import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ProductService } from '../../services/product.service';

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
  
  
  ELEMENT_DATA: PeriodicElement[] = [];
  products : any[] = [];
  displayedColumns: string[] = ['select', 'position', 'image', 'name', 'price', 'status', 'date', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatPaginator) private paginator!: MatPaginator;

  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((data: any) => {
      console.log('Products fetched successfully:', data);
      this.products = data;
      this.ELEMENT_DATA = data.map((item: any, index: number) => ({
        position: index + 1,
        name: item.Name,
        image: item.ThumnailImage || 'assets/images/products/product-1.jpg',
        price: item.Price,
        status: item.Status,
        date: new Date(item.createdAt).toLocaleDateString(),
        ...item
      }));
      this.dataSource.data = this.ELEMENT_DATA;
    }, (error: any) => {
      console.error('Error fetching products:', error);
      // Handle error appropriately, e.g., show a notification or alert
    });
    this.dataSource.paginator = this.paginator;
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
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "data": JSON.stringify({ product: element })
      }
    };
    this.router.navigate(['products/add-product'], navigationExtras);
  }

  delete(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element);
    this.productService.deleteProduct(element.Id).subscribe((response: any) => {
      console.log('Product deleted successfully:', response);
      // Optionally, refresh the product list or remove the deleted product from the UI
      this.products = this.products.filter(product => product.position !== element.position);
      this.ELEMENT_DATA = this.ELEMENT_DATA.filter(item => item.position !== element.position);
      this.dataSource.data = this.ELEMENT_DATA;
    }, (error: any) => {
      console.error('Error deleting product:', error);
      // Handle error appropriately, e.g., show a notification or alert
    });
  }

  createNewProduct() {
    console.log('product new');
    this.router.navigate(['products/add-product']);
  }

  exportProducts() {
    console.log('export products');
    // Implement export logic here
    this.exportToExcel();
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.products);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'products.xlsx');
  }

  importProducts() {
    console.log('import products');
    // Implement import logic here
  }
  viewProduct(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log('view product', element);
    this.router.navigate(['products/view-product', element.position]);
  }
  
}
