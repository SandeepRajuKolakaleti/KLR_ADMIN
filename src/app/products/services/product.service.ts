import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  getHeaders(): any {
    const apiToken = localStorage.getItem('ApiToken');
    if (apiToken) {
      const token = JSON.parse(apiToken).access_token_local;
      const headersRequest = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      };
      return headersRequest;
    }
  }

  getFormDataHeaders(): any {
    const apiToken = localStorage.getItem('ApiToken');
    if (apiToken) {
      const token = JSON.parse(apiToken).access_token_local;
      const headersRequest = {
          'Authorization': `Bearer ${token}`,
      };
      return headersRequest;
    }
  }
  getProducts(offset: number = 0, limit: number = 10) {
    return this.http.get(environment.api.URL+'api/products/getAll', {
      headers: this.getHeaders(),
      params: {
        offset: offset,
        limit: limit
      }
    });
  }
  getProductById(id: string) {
    return this.http.get(environment.api.URL+`api/products/product/${id}`, {
      headers: this.getHeaders()
    });
  }
  createProduct(product: any) {
    return this.http.post(environment.api.URL+'api/products/create-product', product, {
      headers: this.getFormDataHeaders()
    });
  }
  updateProduct(product: any) {
    return this.http.post(environment.api.URL+`api/products/update-product`, product, {
      headers: this.getFormDataHeaders()
    });
  }
  deleteProduct(id: string) {
    return this.http.delete(environment.api.URL+`api/products/product/${id}`, {
      headers: this.getHeaders()
    });
  }
  getImageToBase64(payload: any) {
    return this.http.post(environment.api.URL+'api/products/uploadImgToBase64', payload, {
      headers: this.getHeaders()
    });
  }

  uploadXlsFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(environment.api.URL+'api/products/upload/excel', formData, {
      headers: this.getFormDataHeaders()
    });
  }

  getImageBase64(payload: any) {
    const url = environment.api.URL+ 'api/products/uploadImgToBase64';
    return this.http.post(url, payload, {
      headers: this.getHeaders(),
    })
  }
  
}
