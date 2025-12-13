import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { forkJoin, map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { TranslateConfigService } from 'src/app/shared/services/translate/translate-config.service';
import { CommonBaseComponent } from 'src/app/shared/components/common-base/common-base.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  standalone: false
})
export class UsersComponent extends CommonBaseComponent {
  ELEMENT_DATA: any[] = [];
  users: any[] = [];
  totalUsers: number = 0;
  displayedColumns: string[] = ['select', 'image', 'name', 'email', 'address', 'action'];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  };
  @ViewChild('fileInput') fileInput!: ElementRef;

  offset: number = 0;
  limit: number = 10;

  constructor(private router: Router, private userService: UsersService, 
    private snackBar: MatSnackBar,
    private  translate: TranslateService,
    protected override storageService: StorageService, 
    protected override translateConfigService: TranslateConfigService,) {
      super(translateConfigService, translate, storageService);
      super.ngOnInit();
  }

  override ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers(this.offset, this.limit).subscribe((response: any) => {
      console.log('users fetched successfully:', response.data);
      this.users = response?.data;
      this.totalUsers = response?.total;
      this.processImgToBase64(this.users).subscribe((users: any) => {
        console.log(users);
        this.ELEMENT_DATA = this.users.map((item: any, index: number) => ({
          position: index + 1,
          name: item.name,
          image: item.image || 'assets/images/products/product-1.jpg',
          email: item.email,
          address: item.address,
          date: new Date(item.createdAt).toLocaleDateString(),
          ...item
        }));
        this.dataSource.data = this.ELEMENT_DATA;
        this.matPaginator.length = this.totalUsers;
        this.dataSource.paginator = this.matPaginator;
      });
    }, (error: any) => {
      console.error('Error fetching users:', error);
      // Handle error appropriately, e.g., show a notification or alert
    });
  }

  pageChanged(event: any) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.getUsers();
  }

  processImgToBase64(data: any) {
    const imageObservables = data.map((user: {
      ThumnailImagePath: string; image: string 
    }) => {
      return this.userService.getImageBase64({ url: user.image }).pipe(
        map((response: any) => {
          user.ThumnailImagePath = user.image;
          user.image = response? response.img: '';

          return user;
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

  add() {
    this.router.navigate(['users/add-user']);
  }

  edit(element: any, event: any) {
    console.log(element)
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "data": JSON.stringify({ user: element })
      }
    };
    this.router.navigate(['users/add-user'], navigationExtras);
  }

  delete(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element)
    this.userService.delete(element.id).subscribe((data: any) => {
      console.log('User deleted successfully:', data);
      this.getUsers();
      this.snackBar.open('User deleted successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
    });
  }

  exportUsers() {
    console.log('export users');
    // Implement export logic here
    this.exportToExcel();
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'users.xlsx');
  }

  importClick() {
    this.fileInput.nativeElement.click();
  }

  importUsers(event: any): void {
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
      this.userService.uploadXlsFile(target.files[0]).subscribe((response: any) => {
        console.log('File uploaded successfully:', response);
        // Optionally, refresh the product list or update the UI with the new data
        this.getUsers();
      }, (error: any) => {
        console.error('Error uploading file:', error);
        // Handle error appropriately, e.g., show a notification or alert
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }
}
