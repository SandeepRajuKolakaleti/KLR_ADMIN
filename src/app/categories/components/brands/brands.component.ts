import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { AppConstants } from '../../../../app/app.constants';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { BrandsService } from '../../services/brands.service';
export interface Brand {
  Id: number,
  ThumnailImage: String,
  Name: String,
  Slug: String,
  Status: false
}
@Component({
    selector: 'app-brands',
    templateUrl: './brands.component.html',
    styleUrls: ['./brands.component.scss'],
    standalone: false
})
export class BrandsComponent {
  ELEMENT_DATA: Brand[] = [];
  displayedColumns: string[] = ['select', 'image', 'name', 'slug', 'status', 'action'];
  dataSource = new MatTableDataSource<Brand>(this.ELEMENT_DATA);
  selection = new SelectionModel<Brand>(true, []);
  @ViewChild(MatPaginator) private paginator!: MatPaginator;
  imgSrc: string | ArrayBuffer | null = AppConstants.image.uploadDefault;
  isCreateFlow = true;

  brandFrom!: FormGroup;

  constructor(private router: Router, private brandService: BrandsService, private fb: FormBuilder) {}

  ngOnInit() {
    this.brandFrom = this.fb.group({
      Id: [''],
      File: [null, Validators.required],
      Name: ['', Validators.required],
      Slug: ['', Validators.required],
      Status: ['', Validators.required]
    });
    this.getAll();
  }

  getAll() {
    this.brandService.getAll().subscribe(async (data: Brand[]) => {
      if(data && data.length > 0) {
        let brands: Brand[] = data;
        this.processImgToBase64(brands).subscribe((categoryes: any) => {
          console.log(categoryes);
          this.dataSource = new MatTableDataSource<Brand>(categoryes);
          this.dataSource.paginator = this.paginator;
        });
      } else {
        this.dataSource = new MatTableDataSource<Brand>([]);
      }
    });
  }

  processImgToBase64(data: any) {
    const imageObservables = data.map((category: {
      ThumnailImagePath: string; ThumnailImage: string 
    }) => {
      return this.brandService.getImageBase64({ url: category.ThumnailImage }).pipe(
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
  checkboxLabel(row?: Brand): string {
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
    this.brandFrom.controls['Id'].setValue(element.Id);
    this.brandFrom.controls['File'].setValue(element.ThumnailImagePath);
    this.brandFrom.controls['Slug'].setValue(element.Slug);
    this.brandFrom.controls['Name'].setValue(element.Name);
    this.brandFrom.controls['Status'].setValue(element.Status);
    this.imgSrc = element.ThumnailImage;
  }

  delete(element: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(element);
    this.brandService.delete(element.Id).subscribe((data) => {
      if (data) {
        this.getAll();
      }
    });
  }

  create() {
    console.log(this.brandFrom.value);
    const formData = new FormData();
    formData.append('ThumnailImage', '');
    formData.append('Name', this.brandFrom.controls['Name'].value);
    formData.append('Slug', this.brandFrom.controls['Slug'].value);
    formData.append('Status', this.brandFrom.controls['Status'].value);
    formData.append('file', this.brandFrom.get('File')?.value);
    this.brandService.create(formData).subscribe((data) => {
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
      this.brandFrom.controls['File'].patchValue(file);
      reader.readAsDataURL(file);
  
      // You can also store the file for uploading later
      // this.selectedFile = file;
    }
  }

  editBrand() {
    console.log(this.brandFrom.value);
    const formData = new FormData();
    formData.append('Id', this.brandFrom.controls['Id'].value);
    formData.append('Name', this.brandFrom.controls['Name'].value);
    formData.append('Slug', this.brandFrom.controls['Slug'].value);
    formData.append('Status', this.brandFrom.controls['Status'].value);
    if (typeof this.brandFrom.get('File')?.value === 'object') {
      formData.append('ThumnailImage', '');
      formData.append('file', this.brandFrom.get('File')?.value);
    } else {
      formData.append('ThumnailImage', this.brandFrom.get('File')?.value);
    }
    this.brandService.update(formData).subscribe((data: any) => {
      console.log(data);
      this.getAll();
      this.brandFrom.reset();
      this.imgSrc = AppConstants.image.uploadDefault;
      this.isCreateFlow = true;
    });
  }
}
