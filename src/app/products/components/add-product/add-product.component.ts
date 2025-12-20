import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../categories/services/category.service';
import { SubCategoryService } from '../../../categories/services/sub-category.service';
import { ChildCategoryService } from '../../../categories/services/child-category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VendorService } from '../../../vendors/services/vendor.service';
import { AppConstants } from '../../../app.constants';
import { BrandsService } from 'src/app/categories/services/brands.service';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss'],
    standalone: false
})
export class AddProductComponent implements OnDestroy, OnInit {
  productForm!: FormGroup;
  vendors: any[] = [];
  selectedFile: File | null = null;
  HighlightPosition = {};
  imgSrc: string | ArrayBuffer | null = 'assets/imgs/theme/upload.svg';
  editFlow: boolean = false;
  sub: any;
  product: any = {
    Vendor: '',
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
  categories: any[] = [];
  subCategories: any[] = [];
  subCategoriesData: any[] = [];
  childCategories: any[] = [];
  childCategoriesData: any[] = [];
  SpecificationsKeysList: string[] = [];
  brands: any[]= [];
  constructor(private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    private productService:ProductService,
    private vendorService: VendorService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private childCategoryService: ChildCategoryService,
    private brandsService: BrandsService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.productForm = this.fb.group({
      File: ['', Validators.required],
      // ThmbnailImage: ['', Validators.required],
      Id: [''],
      Vendor: ['', Validators.required],
      Name: ['', Validators.required],
      Slug: ['', Validators.required],
      Category: ['', Validators.required],
      SubCategory: ['', ],
      ChildCategory: ['', ],
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
      SpecificationStatus: [''],
      Specifications: this.fb.array([])
    });
    this.sub = this.route.queryParams.subscribe(params => {
      if (params && params["data"]) {
        this.product = (JSON.parse(params["data"])).product || this.product;
        console.log('Product:', this.product);
        if (this.product && this.product.Id) {
          this.fillForm();
        }
      }
    });
    this.loadBrands();
    this.loadCategories();
    this.loadSubCategories();
    this.loadChildCategories();
    this.loadVendors();
  }

  onCategorySelected(event: any) {
    const selectedCategory = this.productForm.value.Category;
    if (selectedCategory) {
      this.productForm.patchValue({ SubCategory: '', ChildCategory: '' });
      this.getSubCategoriesbyCategory(selectedCategory);
    }
  }

  getSubCategoriesbyCategory(selectedCategory: string) {
    if (selectedCategory) {
      this.subCategories = JSON.parse(localStorage.getItem('subCategories') || '[]');
      this.subCategories = this.subCategoriesData.filter((subCategory: any) => {
        return subCategory.Category === selectedCategory;
      });
      if (this.subCategories.length > 0) {
        this.productForm.controls["SubCategory"].setValue(this.subCategories[0]?.Id.toString());
        this.onSubCategorySelected({ target: { value: Number(this.subCategories[0]?.Id.toString()) } });
      } else {
        this.childCategories = [];
        this.productForm.patchValue({ SubCategory: '', ChildCategory: '' });
      }
    } else {
      this.subCategories = [];
      this.childCategories = [];
      this.productForm.patchValue({ SubCategory: '', ChildCategory: '' });
    }
  }

  onSubCategorySelected(event: any) {
    const selectedSubCategory = this.productForm.value.SubCategory;
    if (selectedSubCategory) {
      this.getChildCategoriesbySubCategory(selectedSubCategory);
    }
  }

  onVendorSelected(event: any) {
    const selectedVendor = this.productForm.value.Vendor;
  }

  getChildCategoriesbySubCategory(selectedSubCategory: string) {
    if (selectedSubCategory) {
      this.childCategories = JSON.parse(localStorage.getItem('childCategories') || '[]');
      this.childCategories = this.childCategoriesData.filter((childCategory: any) => {
        return childCategory.SubCategory === selectedSubCategory;
      });
      if (this.childCategories.length > 0) {
        this.productForm.controls["ChildCategory"].setValue(this.childCategories[0]?.Id.toString());
      }
    } else {
      this.childCategories = [];
      this.productForm.patchValue({ ChildCategory: '' });
    }
  }

  onchildCategorySelected(event: any) {
  }

  onBrandSelected(event: any) {
  }

  loadBrands() {
    this.brandsService.getAll().subscribe((respoonse: any) => {
      console.log(respoonse.data);
      this.brands = respoonse.data;
    })
  }

  loadCategories() {
    this.categoryService.getAll().subscribe((categories: any) => {
      localStorage.setItem('categories', JSON.stringify(categories.data));
      this.categories = categories.data;
    });
  } 

  loadSubCategories() {
    this.subCategoryService.getAll().subscribe((subCategories: any) => {
      localStorage.setItem('subCategories', JSON.stringify(subCategories.data));
      this.subCategoriesData = subCategories.data;
      this.subCategories = this.subCategoriesData;
    });
  }

  loadChildCategories() {
    this.childCategoryService.getAll().subscribe((childCategories: any) => {
      localStorage.setItem('childCategories', JSON.stringify(childCategories.data));
      this.childCategoriesData = childCategories.data;
      this.childCategories = this.childCategoriesData;
    });
  }

  loadVendors() {
    this.vendorService.getVendors().subscribe((vendors: any) => {
      localStorage.setItem('vendors', JSON.stringify(vendors.data));
      this.vendors = vendors.data;
    }); 
  }

  hideSubCategory() {
    return this.subCategories.length > 0 && (this.productForm.value.Category !== '' && this.productForm.value.SubCategory !== '');
  }

  hideChildCategory() {
    return this.childCategories.length > 0 && (this.productForm.value.SubCategory !== '' && this.productForm.value.ChildCategory !== '');
  }

  fillForm() {
    this.editFlow = true;
    this.imgSrc = this.product.ThumnailImage || 'assets/imgs/theme/upload.svg';
    this.productForm.reset();
    this.productForm.markAsPristine();
    this.productForm.markAsUntouched();
    this.productForm.updateValueAndValidity();
    this.productForm.setErrors(null);
    this.product.Specifications = typeof this.product.Specifications === "string"? JSON.parse(this.product.Specifications): this.product.Specifications;
    this.productForm.controls['SpecificationStatus'].setValue(this.product.Specifications.length > 0);
    this.product.Highlight = typeof this.product.Highlight === "string"? JSON.parse(this.product.Highlight): this.product.Highlight;
    if (this.product.Highlight) {
      const Highlight = this.product.Highlight;
      this.productForm.controls['Highlight'].patchValue({
        TopProduct: Highlight.TopProduct || false,
        NewArrival: Highlight.NewArrival || false,
        BestProduct: Highlight.BestProduct || false,
        FeaturedProduct: Highlight.FeaturedProduct || false
      });
    }
    if (this.product.Specifications && this.product.Specifications.length > 0) {
      this.productForm.controls['SpecificationStatus'].setValue(true);
      this.product.Specifications.forEach((spec: any) => {
        this.SpecificationsKeysList.push(spec.key);
        const specificationForm = this.fb.group({
          key: [spec.key, Validators.required],
          specification: [spec.specification, Validators.required]
        });
        this.Specifications.push(specificationForm);
      });
    }
    this.productForm.patchValue({
      // File: this.product.ThumnailImage || '',
      Vendor: Number(this.product.Vendor) || '',
      ...this.product,
    });
    let user = localStorage.getItem('ApiToken');
    const parsedUser = user ? JSON.parse(user) : null;
    if(parsedUser.user_permission === AppConstants.userRole.vendor)
    this.productForm.controls['Vendor'].disable()
    this.productForm.markAsDirty();
    this.productForm.markAsTouched();
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
      this.selectedFile = file;
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
      const formData = new FormData();
      formData.append('ThumnailImage', '');
      formData.append('Vendor', this.productForm.controls['Vendor'].value);
      formData.append('Name', this.productForm.controls['Name'].value);
      formData.append('Slug', this.productForm.controls['Slug'].value);
      formData.append('Status', this.productForm.controls['Status'].value);
      formData.append('Category', this.productForm.controls['Category'].value);
      formData.append('SubCategory', this.productForm.controls['SubCategory'].value);
      formData.append('ChildCategory', this.productForm.controls['ChildCategory'].value);
      formData.append('Brand', this.productForm.controls['Brand'].value);
      formData.append('SKU', this.productForm.controls['SKU'].value);
      formData.append('Price', this.productForm.controls['Price'].value);
      formData.append('OfferPrice', this.productForm.controls['OfferPrice'].value);
      formData.append('StockQuantity', this.productForm.controls['StockQuantity'].value);
      formData.append('Weight', this.productForm.controls['Weight'].value);
      formData.append('ShortDescription', this.productForm.controls['ShortDescription'].value);
      formData.append('LongDescription', this.productForm.controls['LongDescription'].value);
      formData.append('SEOTitle', this.productForm.controls['SEOTitle'].value);
      formData.append('SEODescription', this.productForm.controls['SEODescription'].value);
      console.log('Highlight:', this.productForm.controls['Highlight'].value);
      formData.append('Highlight', JSON.stringify(this.productForm.controls['Highlight'].value));
      console.log('Specifications:', JSON.stringify(this.Specifications.value));
      formData.append('Specifications', JSON.stringify(this.Specifications.value));
      if (this.productForm.controls['File'].value) {
        formData.append('file', this.selectedFile as Blob);
      }
      // You can call a service to save the product here
      this.productService.createProduct(formData).subscribe(
        (response: any) => {
          console.log('Product created successfully:', response);
          // Handle success, e.g., navigate to product list or show a success message
          this.snackBar.open('Product created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.router.navigate(['products']);
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
    console.log('Editing product:', this.productForm.value);
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('ThumnailImage', '');
      formData.append('Id', this.productForm.controls['Id'].value);
      formData.append('Vendor', this.productForm.controls['Vendor'].value);
      formData.append('Name', this.productForm.controls['Name'].value);
      formData.append('Slug', this.productForm.controls['Slug'].value);
      formData.append('Status', this.productForm.controls['Status'].value);
      formData.append('Category', this.productForm.controls['Category'].value);
      formData.append('SubCategory', this.productForm.controls['SubCategory'].value);
      formData.append('ChildCategory', this.productForm.controls['ChildCategory'].value);
      formData.append('Brand', this.productForm.controls['Brand'].value);
      formData.append('SKU', this.productForm.controls['SKU'].value);
      formData.append('Price', this.productForm.controls['Price'].value);
      formData.append('OfferPrice', this.productForm.controls['OfferPrice'].value);
      formData.append('StockQuantity', this.productForm.controls['StockQuantity'].value);
      formData.append('Weight', this.productForm.controls['Weight'].value);
      formData.append('ShortDescription', this.productForm.controls['ShortDescription'].value);
      formData.append('LongDescription', this.productForm.controls['LongDescription'].value);
      formData.append('SEOTitle', this.productForm.controls['SEOTitle'].value);
      formData.append('SEODescription', this.productForm.controls['SEODescription'].value);
      console.log('Highlight:', this.productForm.controls['Highlight'].value);
      formData.append('Highlight', JSON.stringify(this.productForm.controls['Highlight'].value));
      console.log('Specifications:', JSON.stringify(this.Specifications.value));
      formData.append('Specifications', JSON.stringify(this.Specifications.value));
      if (this.productForm.controls['File'].value) {
        formData.append('file', this.selectedFile as Blob);
      }
      this.productService.updateProduct(formData).subscribe(
        (response: any) => {
          console.log('Product updated successfully:', response);
          // Handle success, e.g., navigate to product list or show a success message
          this.snackBar.open('Product updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.router.navigate(['products']);
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
