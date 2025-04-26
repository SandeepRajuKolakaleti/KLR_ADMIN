import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { PeriodicElement } from 'src/app/products/components/products/products.component';
import { SubCategoryService } from '../../services/sub-category.service';
import { CategoryService } from '../../services/category.service';
import { ChildCategoryService } from '../../services/child-category.service';
import { forkJoin, map } from 'rxjs';
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
  styleUrls: ['./child-categories.component.scss']
})
export class ChildCategoriesComponent {
  ELEMENT_DATA: ChildCategory[] = [];
  displayedColumns: string[] = ['select', 'image', 'name', 'category', 'subCategory', 'slug', 'status', 'action'];
  dataSource = new MatTableDataSource<ChildCategory>(this.ELEMENT_DATA);
  selection = new SelectionModel<ChildCategory>(true, []);
  @ViewChild(MatPaginator) private paginator!: MatPaginator;
  imgSrc: string | ArrayBuffer | null = AppConstants.image.uploadDefault;
  isCreateFlow = true;

  childCategoryFrom!: FormGroup;
  categories!: any;
  selectedCategory = 0;
  subCategories!: any;
  selectedSubCategory = 0;

  constructor(private router: Router, private subCategoryService: SubCategoryService, private fb: FormBuilder,
    private categoryService: CategoryService, private childCategoryService: ChildCategoryService
  ) {}

  ngOnInit() {
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
    this.getAllSubCategories();
  }

  getAllCategories() {
    this.categoryService.getAll().subscribe((data) => {
      console.log(data);
      this.categories = data;
    })
  }

  getAllSubCategories() {
    this.subCategoryService.getAll().subscribe((data) => {
      console.log(data);
      this.subCategories = data;
    })
  }

  getAll() {
    this.childCategoryService.getAll().subscribe(async (data: ChildCategory[]) => {
      if(data && data.length > 0) {
        let brands: ChildCategory[] = data;
        this.processImgToBase64(brands).subscribe((categoryes: any) => {
          console.log(categoryes);
          this.dataSource = new MatTableDataSource<ChildCategory>(categoryes);
          this.dataSource.paginator = this.paginator;
        });
      } else {
        this.dataSource = new MatTableDataSource<ChildCategory>([]);
      }
    });
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
  }

  delete(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element);
    this.childCategoryService.delete(element.Id).subscribe((data) => {
      if (data) {
        this.getAll();
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
    });
  }
}
