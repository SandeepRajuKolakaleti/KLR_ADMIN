import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { AppConstants } from '../../../app.constants';
import { CategoryService } from '../../services/category.service';
import { SubCategoryService } from '../../services/sub-category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonBaseComponent } from '../../../shared/components/common-base/common-base.component';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { TranslateConfigService } from '../../../shared/services/translate/translate-config.service';
export interface SubCategory {
  Id: number,
  ThumnailImage: String,
  Category: string;
  Name: String,
  Slug: String,
  Status: false
}
@Component({
    selector: 'app-sub-categories',
    templateUrl: './sub-categories.component.html',
    styleUrls: ['./sub-categories.component.scss'],
    standalone: false
})
export class SubCategoriesComponent extends CommonBaseComponent {
  totalSubCategories: number = 0;
  ELEMENT_DATA: SubCategory[] = [];
  displayedColumns: string[] = ['select', 'image', 'name', 'category', 'slug', 'status', 'action'];
  dataSource = new MatTableDataSource<SubCategory>(this.ELEMENT_DATA);
  selection = new SelectionModel<SubCategory>(true, []);
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  };
  offset: number = 0;
  limit: number = 10;
  imgSrc: string | ArrayBuffer | null = AppConstants.image.uploadDefault;
  isCreateFlow = true;

  subCategoryFrom!: FormGroup;
  categories!: any;
  selectedCategory = 0;

  constructor(private router: Router, private subCategoryService: SubCategoryService, private fb: FormBuilder,
    private categoryService: CategoryService, private snackBar: MatSnackBar,
    private  translate: TranslateService,
    protected override storageService: StorageService, 
    protected override translateConfigService: TranslateConfigService,
  ) {
    super(translateConfigService, translate, storageService);
    super.ngOnInit();
  }

  override ngOnInit(): void {
    this.subCategoryFrom = this.fb.group({
      Id: [''],
      File: [null, Validators.required],
      Category: ['', Validators.required],
      Name: ['', Validators.required],
      Slug: ['', Validators.required],
      Status: ['', Validators.required]
    });
    this.getAll();
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getAll().subscribe((response: any) => {
      console.log(response);
      let data: any = response.data;
      this.categories = data;
    })
  }

  getAll() {
    this.subCategoryService.getAll(this.offset, this.limit).subscribe(async (response: any) => {
      let data: SubCategory[] = response.data;
      this.totalSubCategories = response.total;
      if(data && data.length > 0) {
        let brands: SubCategory[] = data;
        this.processImgToBase64(brands).subscribe((categoryes: any) => {
          console.log(categoryes);
          this.dataSource = new MatTableDataSource<SubCategory>(categoryes);
          this.dataSource.paginator = this.matPaginator;
        });
      } else {
        this.dataSource = new MatTableDataSource<SubCategory>([]);
      }
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
      return this.subCategoryService.getImageBase64({ url: category.ThumnailImage }).pipe(
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
  checkboxLabel(row?: SubCategory): string {
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
    this.subCategoryFrom.controls['Id'].setValue(element.Id);
    this.subCategoryFrom.controls['File'].setValue(element.ThumnailImagePath);
    this.subCategoryFrom.controls['Slug'].setValue(element.Slug);
    this.subCategoryFrom.controls['Name'].setValue(element.Name);
    this.subCategoryFrom.controls['Status'].setValue(element.Status);
    this.subCategoryFrom.controls['Category'].setValue(parseInt(element.Category, 10));
    this.selectedCategory = parseInt(element.Category, 10);
    this.imgSrc = element.ThumnailImage;
  }

  delete(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element);
    this.subCategoryService.delete(element.Id).subscribe((data) => {
      if (data) {
        this.getAll();
        this.snackBar.open('sub category deleted successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }
    });
  }

  create() {
    console.log(this.subCategoryFrom.value);
    const formData = new FormData();
    formData.append('ThumnailImage', '');
    formData.append('Name', this.subCategoryFrom.controls['Name'].value);
    formData.append('Category', this.subCategoryFrom.controls['Category'].value);
    formData.append('Slug', this.subCategoryFrom.controls['Slug'].value);
    formData.append('Status', this.subCategoryFrom.controls['Status'].value);
    formData.append('file', this.subCategoryFrom.get('File')?.value);
    this.subCategoryService.create(formData).subscribe((data) => {
      console.log(data);
      this.getAll();
      this.snackBar.open('sub category added successfully!', 'Close', {
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
      this.subCategoryFrom.controls['File'].patchValue(file);
      reader.readAsDataURL(file);
  
      // You can also store the file for uploading later
      // this.selectedFile = file;
    }
  }

  editSubCategory() {
    console.log(this.subCategoryFrom.value);
    const formData = new FormData();
    formData.append('Id', this.subCategoryFrom.controls['Id'].value);
    formData.append('Name', this.subCategoryFrom.controls['Name'].value);
    formData.append('Category', this.subCategoryFrom.controls['Category'].value);
    formData.append('Slug', this.subCategoryFrom.controls['Slug'].value);
    formData.append('Status', this.subCategoryFrom.controls['Status'].value);
    if (typeof this.subCategoryFrom.get('File')?.value === 'object') {
      formData.append('ThumnailImage', '');
      formData.append('file', this.subCategoryFrom.get('File')?.value);
    } else {
      formData.append('ThumnailImage', this.subCategoryFrom.get('File')?.value);
    }
    this.subCategoryService.update(formData).subscribe((data: any) => {
      console.log(data);
      this.getAll();
      this.subCategoryFrom.reset();
      this.imgSrc = AppConstants.image.uploadDefault;
      this.isCreateFlow = true;
      this.snackBar.open('sub category updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
    });
  }

  reset() {
    this.subCategoryFrom.reset();
    this.imgSrc = AppConstants.image.uploadDefault;
    this.isCreateFlow = true;
  }
}
