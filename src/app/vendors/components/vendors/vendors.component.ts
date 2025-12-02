import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { VendorService } from '../../services/vendor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { forkJoin, map } from 'rxjs';

@Component({
    selector: 'app-vendors',
    templateUrl: './vendors.component.html',
    styleUrls: ['./vendors.component.scss'],
    standalone: false
})
export class VendorsComponent implements OnInit, AfterViewInit {
  ELEMENT_DATA: any[] = [];
  vendors: any[] = [];
  totalVendors: number = 0;
  displayedColumns: string[] = ['select', 'image', 'name', 'email', 'address', 'action'];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  };
  @ViewChild('fileInput') fileInput!: ElementRef;

  offset: number = 0;
  limit: number = 10;

  constructor(private router: Router, private vendorService: VendorService, 
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getVendors();
  }

  getVendors() {
    this.vendorService.getVendors(this.offset, this.limit).subscribe((response: any) => {
      console.log('Vendors fetched successfully:', response.data);
      this.vendors = response?.data;
      this.totalVendors = response.total;
      this.processImgToBase64(this.vendors).subscribe((vendors: any) => {
        console.log(vendors);
        this.ELEMENT_DATA = this.vendors.map((item: any, index: number) => ({
          position: index + 1,
          name: item.name,
          image: item.image || 'assets/images/products/product-1.jpg',
          email: item.email,
          address: item.address,
          date: new Date(item.createdAt).toLocaleDateString(),
          ...item
        }));
        this.dataSource.data = this.ELEMENT_DATA;
        this.dataSource.paginator = this.matPaginator;
      });
    }, (error: any) => {
      console.error('Error fetching users:', error);
      // Handle error appropriately, e.g., show a notification or alert
    });
    this.dataSource.paginator = this.matPaginator;
  }

  pageChanged(event: any) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.getVendors();
  }

  processImgToBase64(data: any) {
    const imageObservables = data.map((vendor: {
      ThumnailImagePath: string; image: string 
    }) => {
      return this.vendorService.getImageBase64({ url: vendor.image }).pipe(
        map((response: any) => {
          vendor.ThumnailImagePath = vendor.image;
          vendor.image = response? response.img: '';

          return vendor;
        })
      );
    });
    return forkJoin(imageObservables); 
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.matPaginator;
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
        this.dataSource.paginator = this.matPaginator;
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
    //this.router.navigate(['vendors/vendor-detail', { data: JSON.stringify(element)}]);
    this.router.navigate(['vendors/vendor-detail/'+ element.id]);
    // {
    //   data: element.Id,
    //   querParams: JSON.stringify({ id: element.Id })
    // }
  }

  addVendor() {
    this.router.navigate(['vendors/add-vendor']);
  }

  editVendor(element: any, event: any) {
    console.log(element)
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "data": JSON.stringify({ vendor: element })
      }
    };
    this.router.navigate(['vendors/add-vendor'], navigationExtras);
  }

  delete(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element)
    this.vendorService.delete(element.id).subscribe((data: any) => {
      console.log('Vendor deleted successfully:', data);
      this.getVendors();
      this.snackBar.open('Vendor deleted successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
    });
  }

  exportVendors() {
    console.log('export vendors');
    // Implement export logic here
    this.exportToExcel();
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.vendors);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendors');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'vendors.xlsx');
  }

  importClick() {
    this.fileInput.nativeElement.click();
  }

  importVendorss(event: any): void {
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
      this.vendorService.uploadXlsFile(target.files[0]).subscribe((response: any) => {
        console.log('File uploaded successfully:', response);
        // Optionally, refresh the product list or update the UI with the new data
        this.vendorService.getVendors().subscribe((data: any) => {
          console.log('Vendors fetched successfully after import:', data);
          this.vendors = data;
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
  viewVendor(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log('view vendor', element);
    this.router.navigate(['vendors/view-vendor', element.Id]);
  }
}
