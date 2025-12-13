import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { AppConstants } from '../../../app.constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { TranslateConfigService } from '../../../shared/services/translate/translate-config.service';
import { CommonBaseComponent } from '../../../shared/components/common-base/common-base.component';
export interface Category {
  Id: number,
  ThumnailImage: String,
  Name: String,
  Slug: String,
  Status: false
}
@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    standalone: false
})
export class CategoriesComponent extends CommonBaseComponent implements OnInit, AfterViewInit{
  totalCategories: number = 0;
  ELEMENT_DATA: Category[] = [];
  displayedColumns: string[] = ['select', 'image', 'name', 'slug', 'status', 'action'];
  dataSource = new MatTableDataSource<Category>(this.ELEMENT_DATA);
  selection = new SelectionModel<Category>(true, []);
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  };
  offset: number = 0;
  limit: number = 10;
  imgSrc: string | ArrayBuffer | null = AppConstants.image.uploadDefault;
  isCreateFlow = true;

  categoryFrom!: FormGroup;

  constructor(private router: Router, private categoryService: CategoryService, private fb: FormBuilder, private snackBar: MatSnackBar,
    private  translate: TranslateService,
    protected override storageService: StorageService, 
    protected override translateConfigService: TranslateConfigService,
  ) {
    super(translateConfigService, translate, storageService);
    super.ngOnInit();
  }

  override ngOnInit(): void {
    this.categoryFrom = this.fb.group({
      Id: [''],
      File: [null, Validators.required],
      Name: ['', Validators.required],
      Slug: ['', Validators.required],
      Status: ['', Validators.required]
    });
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getAll(this.offset, this.limit).subscribe(async (response: any) => {
      let categories: Category[] = response.data;
      this.totalCategories = response.total;
      this.processImgToBase64(categories).subscribe((categoryes: any) => {
        console.log(categoryes);
        this.dataSource = new MatTableDataSource<Category>(categoryes);
        this.dataSource.paginator = this.matPaginator;
      });
    });
  }

  pageChanged(event: any) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.getAllCategories();
  }

  processImgToBase64(data: any) {
    const imageObservables = data.map((category: {
      ThumnailImagePath: string; ThumnailImage: string 
    }) => {
      return this.categoryService.getImageBase64({ url: category.ThumnailImage }).pipe(
        map((response: any) => {
          category.ThumnailImagePath = category.ThumnailImage;
          category.ThumnailImage = response? response.img: '';

          return category;
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
        this.dataSource.data.forEach(row => this.selection.select(row));
        this.dataSource.paginator = this.matPaginator;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Category): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id + 1}`;
  }

  edit(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element)
    this.isCreateFlow = false;
    this.categoryFrom.controls['Id'].setValue(element.Id);
    this.categoryFrom.controls['File'].setValue(element.ThumnailImagePath);
    this.categoryFrom.controls['Slug'].setValue(element.Slug);
    this.categoryFrom.controls['Name'].setValue(element.Name);
    this.categoryFrom.controls['Status'].setValue(element.Status);
    this.imgSrc = element.ThumnailImage;
  }

  delete(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element);
    this.categoryService.delete(element.Id).subscribe((data) => {
      if (data) {
        this.getAllCategories();
        this.snackBar.open('category deleted successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }
    });
  }

  createCategory() {
    console.log(this.categoryFrom.value);
    const formData = new FormData();
    formData.append('ThumnailImage', '');
    formData.append('Name', this.categoryFrom.controls['Name'].value);
    formData.append('Slug', this.categoryFrom.controls['Slug'].value);
    formData.append('Status', this.categoryFrom.controls['Status'].value);
    formData.append('file', this.categoryFrom.get('File')?.value);
    this.categoryService.create(formData).subscribe((data) => {
      console.log(data);
      this.getAllCategories();
      this.snackBar.open('category added successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0] as Blob;
  
      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imgSrc = reader.result;
      };
      this.categoryFrom.controls['File'].patchValue(file);
      reader.readAsDataURL(file);
  
      // You can also store the file for uploading later
      // this.selectedFile = file;
    }
  }

  editCategory() {
    console.log(this.categoryFrom.value);
    const formData = new FormData();
    formData.append('Id', this.categoryFrom.controls['Id'].value);
    formData.append('Name', this.categoryFrom.controls['Name'].value);
    formData.append('Slug', this.categoryFrom.controls['Slug'].value);
    formData.append('Status', this.categoryFrom.controls['Status'].value);
    if (typeof this.categoryFrom.get('File')?.value === 'object') {
      formData.append('ThumnailImage', '');
      formData.append('file', this.categoryFrom.get('File')?.value);
    } else {
      formData.append('ThumnailImage', this.categoryFrom.get('File')?.value);
    }
    this.categoryService.update(formData).subscribe((data: any) => {
      console.log(data);
      this.getAllCategories();
      this.categoryFrom.reset();
      this.imgSrc = AppConstants.image.uploadDefault;
      this.isCreateFlow = true;
      this.snackBar.open('category updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
    });
  }

  reset() {
    this.categoryFrom.reset();
    this.imgSrc = AppConstants.image.uploadDefault;
    this.isCreateFlow = true;
  }
}
