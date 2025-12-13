import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppConstants } from '../../../app.constants';
import { SubCategoryService } from '../../services/sub-category.service';
import { CategoryService } from '../../services/category.service';
import { ChildCategoryService } from '../../services/child-category.service';
import { forkJoin, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonBaseComponent } from '../../../shared/components/common-base/common-base.component';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { TranslateConfigService } from '../../../shared/services/translate/translate-config.service';
export interface ChildCategory {
  Id: number,
  ThumnailImage: String,
  Category: string;
  SubCategory: string;
  Name: String,
  Slug: String,
  Status: false
}
@Component({
    selector: 'app-child-categories',
    templateUrl: './child-categories.component.html',
    styleUrls: ['./child-categories.component.scss'],
    standalone: false
})
export class ChildCategoriesComponent extends CommonBaseComponent  {
  totalChildCategories: number = 0;
  ELEMENT_DATA: ChildCategory[] = [];
  displayedColumns: string[] = ['select', 'image', 'name', 'category', 'subCategory', 'slug', 'status', 'action'];
  dataSource = new MatTableDataSource<ChildCategory>(this.ELEMENT_DATA);
  selection = new SelectionModel<ChildCategory>(true, []);
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  };
  offset: number = 0;
  limit: number = 10;
  imgSrc: string | ArrayBuffer | null = AppConstants.image.uploadDefault;
  isCreateFlow = true;

  childCategoryFrom!: FormGroup;
  categories!: any;
  selectedCategory = 0;
  subCategories!: any;
  selectedSubCategory = 0;

  constructor(private router: Router, private subCategoryService: SubCategoryService, private fb: FormBuilder,
    private categoryService: CategoryService, private childCategoryService: ChildCategoryService, private snackBar: MatSnackBar,
    private  translate: TranslateService,
    protected override storageService: StorageService, 
    protected override translateConfigService: TranslateConfigService,
  ) {
    super(translateConfigService, translate, storageService);
    super.ngOnInit();
  }

  override ngOnInit(): void {
    this.childCategoryFrom = this.fb.group({
      Id: [''],
      File: [null, Validators.required],
      Category: ['', Validators.required],
      SubCategory: ['', Validators.required],
      Name: ['', Validators.required],
      Slug: ['', Validators.required],
      Status: ['', Validators.required]
    });
    this.getAll();
    this.getAllCategories();
  }

  onSelectCategoryChange(event: any) {
    console.log(this.selectedCategory);
    console.log('Selected value:', event.value);
    console.log('Form value:', this.childCategoryFrom.value);
    this.getAllSubCategories();
  }

  getAllCategories() {
    this.categoryService.getAll().subscribe((data) => {
      console.log(data);
      this.categories = data;
    })
  }

  getAllSubCategories() {
    console.log(this.selectedCategory);
    this.subCategoryService.getSubCategoriesByCategoryId(this.selectedCategory).subscribe((data) => {
      console.log(data);
      this.subCategories = data;
    })
  }

  getAll() {
    this.childCategoryFrom.reset();
    this.childCategoryService.getAll().subscribe(async (response: any) => {
      this.totalChildCategories = response.total;
      let data: ChildCategory[] = response.data;
      if(data && data.length > 0) {
        let brands: ChildCategory[] = data;
        this.processImgToBase64(brands).subscribe((categoryes: any) => {
          console.log(categoryes);
          this.dataSource = new MatTableDataSource<ChildCategory>(categoryes);
          this.dataSource.paginator = this.matPaginator;
        });
      } else {
        this.dataSource = new MatTableDataSource<ChildCategory>([]);
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
      return this.childCategoryService.getImageBase64({ url: category.ThumnailImage }).pipe(
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
  checkboxLabel(row?: ChildCategory): string {
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
    this.childCategoryFrom.controls['Id'].setValue(element.Id);
    this.childCategoryFrom.controls['File'].setValue(element.ThumnailImagePath);
    this.childCategoryFrom.controls['Slug'].setValue(element.Slug);
    this.childCategoryFrom.controls['Name'].setValue(element.Name);
    this.childCategoryFrom.controls['Status'].setValue(element.Status);
    this.childCategoryFrom.controls['Category'].setValue(parseInt(element.Category, 10));
    this.selectedCategory = parseInt(element.Category, 10);
    this.childCategoryFrom.controls['SubCategory'].setValue(parseInt(element.SubCategory, 10));
    this.selectedSubCategory = parseInt(element.SubCategory, 10);
    this.imgSrc = element.ThumnailImage;
    this.getAllSubCategories();
  }

  delete(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element);
    this.childCategoryService.delete(element.Id).subscribe((data) => {
      if (data) {
        this.getAll();
        this.snackBar.open('child category deleted successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }
    });
  }

  create() {
    console.log(this.childCategoryFrom.value);
    const formData = new FormData();
    formData.append('ThumnailImage', '');
    formData.append('Name', this.childCategoryFrom.controls['Name'].value);
    formData.append('Category', this.childCategoryFrom.controls['Category'].value);
    formData.append('SubCategory', this.childCategoryFrom.controls['SubCategory'].value);
    formData.append('Slug', this.childCategoryFrom.controls['Slug'].value);
    formData.append('Status', this.childCategoryFrom.controls['Status'].value);
    formData.append('file', this.childCategoryFrom.get('File')?.value);
    this.childCategoryService.create(formData).subscribe((data) => {
      console.log(data);
      this.getAll();
      this.snackBar.open('child category added successfully!', 'Close', {
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
      this.childCategoryFrom.controls['File'].patchValue(file);
      reader.readAsDataURL(file);
  
      // You can also store the file for uploading later
      // this.selectedFile = file;
    }
  }

  editSubCategory() {
    console.log(this.childCategoryFrom.value);
    const formData = new FormData();
    formData.append('Id', this.childCategoryFrom.controls['Id'].value);
    formData.append('Name', this.childCategoryFrom.controls['Name'].value);
    formData.append('Category', this.childCategoryFrom.controls['Category'].value);
    formData.append('SubCategory', this.childCategoryFrom.controls['SubCategory'].value);
    formData.append('Slug', this.childCategoryFrom.controls['Slug'].value);
    formData.append('Status', this.childCategoryFrom.controls['Status'].value);
    if (typeof this.childCategoryFrom.get('File')?.value === 'object') {
      formData.append('ThumnailImage', '');
      formData.append('file', this.childCategoryFrom.get('File')?.value);
    } else {
      formData.append('ThumnailImage', this.childCategoryFrom.get('File')?.value);
    }
    this.childCategoryService.update(formData).subscribe((data: any) => {
      console.log(data);
      this.getAll();
      this.childCategoryFrom.reset();
      this.imgSrc = AppConstants.image.uploadDefault;
      this.isCreateFlow = true;
      this.snackBar.open('child category updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
    });
  }

  reset() {
    this.childCategoryFrom.reset();
    this.imgSrc = AppConstants.image.uploadDefault;
    this.isCreateFlow = true;
  }
}
