import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ProductService } from '../../services/product.service';
import { forkJoin, map } from 'rxjs';

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
  styleUrls: ['./products.component.scss'],
  standalone: false
})
export class ProductsComponent implements OnInit, AfterViewInit {
  
  
  ELEMENT_DATA: PeriodicElement[] = [];
  products : any[] = [];
  displayedColumns: string[] = ['select', 'position', 'image', 'name', 'price', 'status', 'date', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatPaginator) private paginator!: MatPaginator;
  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((data: any) => {
      console.log('Products fetched successfully:', data);
      this.products = data;
      this.processImgToBase64(this.products).subscribe((products: any) => {
        console.log(products);
        this.dataSource = new MatTableDataSource<PeriodicElement>(products);
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
        this.dataSource.paginator = this.paginator;
      });
    }, (error: any) => {
      console.error('Error fetching products:', error);
      // Handle error appropriately, e.g., show a notification or alert
    });
    this.dataSource.paginator = this.paginator;
  }

  processImgToBase64(data: any) {
    const imageObservables = data.map((product: {
      ThumnailImagePath: string; ThumnailImage: string 
    }) => {
      return this.productService.getImageBase64({ url: product.ThumnailImage }).pipe(
        map((response: any) => {
          product.ThumnailImagePath = product.ThumnailImage;
          product.ThumnailImage = response? response.img: '';
          return product;
        })
      );
    });
    return forkJoin(imageObservables); 
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

  importClick() {
    this.fileInput.nativeElement.click();
  }

  importProducts(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      alert('Please select a single file.');
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log('Imported Data:', data);
      // TODO: Process and save file data
      this.productService.uploadXlsFile(target.files[0]).subscribe((response: any) => {
        console.log('File uploaded successfully:', response);
        // Optionally, refresh the product list or update the UI with the new data
        this.productService.getProducts().subscribe((data: any) => {
          console.log('Products fetched successfully after import:', data);
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
          console.error('Error fetching products after import:', error);
          // Handle error appropriately, e.g., show a notification or alert
        });
      }, (error: any) => {
        console.error('Error uploading file:', error);
        // Handle error appropriately, e.g., show a notification or alert
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }
  viewProduct(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log('view product', element);
    this.router.navigate(['products/view-product', element.position]);
  }
  
}
