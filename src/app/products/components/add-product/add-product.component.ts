import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnDestroy, OnInit {
  productForm!: FormGroup;
  HighlightPosition = {};
  imgSrc: string | ArrayBuffer | null = 'assets/imgs/theme/upload.svg';
  editFlow: boolean = false;
  sub: any;
  product: any = {
    File: '',
    Name: '',
    Slug: '',
    Category: '',
    SubCategory: '',
    ChildCategory: '',
    Brand: '',
    SKU: '',
    Price: '',
    OfferPrice: '',
    StockQuantity: '',
    Weight: '',
    ShortDescription: '',
    LongDescription: '',
    Highlight: {
      TopProduct: false,
      NewArrival: false,
      BestProduct: false,
      FeaturedProduct: false
    },
    Status: 'Active',
    SEOTitle: '',
    SEODescription: '',
    SpecificationStatus: 'Active',
  };
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private productService:ProductService) {}
  ngOnInit() {
    this.productForm = this.fb.group({
      File: ['', Validators.required],
      // ThmbnailImage: ['', Validators.required],
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
    this.sub = this.route.queryParams.subscribe(params => {
      if (params && params["data"]) {
        this.product = (JSON.parse(params["data"])).product || this.product;
        if (this.product && this.product.Id) {
          this.fillForm();
        }
      }
    });
  }

  fillForm() {
    this.editFlow = true;
    this.imgSrc = this.product.ThumnailImage || 'assets/imgs/theme/upload.svg';
    this.productForm.reset();
    this.productForm.markAsPristine();
    this.productForm.markAsUntouched();
    this.productForm.updateValueAndValidity();
    this.productForm.setErrors(null);
    this.productForm.patchValue({
      File: this.product.ThumnailImage || '',
      Name: this.product.Name,
      Slug: this.product.Slug,
      Category: this.product.Category,
      SubCategory: this.product.SubCategory,
      ChildCategory: this.product.ChildCategory,
      Brand: this.product.Brand,
      SKU: this.product.SKU,
      Price: this.product.Price,
      OfferPrice: this.product.OfferPrice,
      StockQuantity: this.product.StockQuantity,
      Weight: this.product.Weight,
      ShortDescription: this.product.ShortDescription,
      LongDescription: this.product.LongDescription,
      Highlight: {
        TopProduct: this.product.Highlight.TopProduct,
        NewArrival: this.product.Highlight.NewArrival,
        BestProduct: this.product.Highlight.BestProduct,
        FeaturedProduct: this.product.Highlight.FeaturedProduct
      },
      Status: this.product.Status,
      SEOTitle: this.product.SEOTitle,
      SEODescription: this.product.SEODescription,
      SpecificationStatus: this.product.SpecificationStatus
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

  saveProduct() {
    if (this.productForm.valid) {
      // Logic to save the product
      console.log('Product saved:', this.productForm.value);
      // You can call a service to save the product here
      this.productService.createProduct(this.productForm.value).subscribe(
        (response: any) => {
          console.log('Product created successfully:', response);
          // Handle success, e.g., navigate to product list or show a success message
        },
        (error: any) => {
          console.error('Error creating product:', error);
          // Handle error, e.g., show an error message
        }
      );
      // Reset the form after saving
      this.productForm.reset();
      this.imgSrc = 'assets/imgs/theme/upload.svg'; // Reset image preview
      this.editFlow = false; // Reset edit flow
      this.productForm.markAsPristine();
      this.productForm.markAsUntouched();
      this.productForm.updateValueAndValidity();
      this.productForm.setErrors(null);
      this.Specifications.clear(); // Clear specifications array
    } else {
      console.error('Form is invalid');
    }
  }

  editProduct() {
    if (this.productForm.valid) {
      // Logic to edit the product
      console.log('Product edited:', this.productForm.value);
      // You can call a service to update the product here
      this.productService.updateProduct(this.product._id, this.productForm.value).subscribe(
        (response: any) => {
          console.log('Product updated successfully:', response);
          // Handle success, e.g., navigate to product list or show a success message
        },
        (error: any) => {
          console.error('Error updating product:', error);
          // Handle error, e.g., show an error message
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    } 
  }
}
