import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

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
  getProducts() {
    return this.http.get(environment.api.URL+'api/products/getAll', {
      headers: this.getHeaders()
    });
  }
  getProductById(id: string) {
    return this.http.get(`api/products/product/${id}`, {
      headers: this.getHeaders()
    });
  }
  createProduct(product: any) {
    return this.http.post(environment.api.URL+'api/products/create-product', product, {
      headers: this.getHeaders()
    });
  }
  updateProduct(id: string, product: any) {
    return this.http.post(environment.api.URL+`api/products/update-product`, product, {
      headers: this.getHeaders()
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
  
}
