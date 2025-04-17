import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  productForm!: FormGroup;
  HighlightPosition = {};
  imgSrc: string | ArrayBuffer | null = 'assets/imgs/theme/upload.svg';
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.productForm = this.fb.group({
      ThmbnailImage: ['', Validators.required],
      Name: ['', Validators.required],
      Slug: ['', Validators.required],
      Category: ['', Validators.required],
      SubCategory: ['', Validators.required],
      ChildCategory: ['', Validators.required],
      Brand: ['', Validators.required],
      SKU: ['', Validators.required],
      Price: ['', Validators.required],
      OfferPrice: ['', Validators.required],
      StockQuantity: ['', Validators.required],
      Weight: ['', Validators.required],
      ShortDescription: ['', Validators.required],
      LongDescription: ['', Validators.required],
      Highlight: this.fb.group({
        TopProduct: ['', Validators.required],
        NewArrival: ['', Validators.required],
        BestProduct: ['', Validators.required],
        FeaturedProduct: ['', Validators.required]
      }),
      Status: ['', Validators.required],
      SEOTitle: ['', Validators.required],
      SEODescription: ['', Validators.required],
      SpecificationStatus: ['', Validators.required],
      Specifications: this.fb.array([])
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      const file = input.files[0];
  
      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imgSrc = reader.result;
      };
      reader.readAsDataURL(file);
  
      // You can also store the file for uploading later
      // this.selectedFile = file;
    }
  }

  get Specifications() {
    return this.productForm.controls["Specifications"] as FormArray;
  }

  addSpecification() {
    const specificationForm = this.fb.group({
      key: ['', Validators.required],
      specification: ['', Validators.required]
    });
    this.Specifications.push(specificationForm);
  }
  deleteSpecification(index: number) {
    this.Specifications.removeAt(index);
  }
}
