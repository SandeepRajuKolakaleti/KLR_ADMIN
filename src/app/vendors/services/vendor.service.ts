import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
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
  getVendors() {
    return this.http.get(environment.api.URL+'api/vendors/getAll', {
      headers: this.getHeaders()
    });
  }
  getProductsById(id: string) {
    return this.http.get(environment.api.URL+`api/vendors/productsByVendor/${id}`, {
      headers: this.getHeaders()
    });
  }
  getVendorsById(id: string) {
    return this.http.get(environment.api.URL+`api/vendors/vendor/${id}`, {
      headers: this.getHeaders()
    });
  }
  create(vendor: any) {
    return this.http.post(environment.api.URL+'api/vendors/create-vendor', vendor, {
      headers: this.getFormDataHeaders()
    });
  }
  update(vendor: any) {
    return this.http.post(environment.api.URL+`api/vendors/update-vendor`, vendor, {
      headers: this.getFormDataHeaders()
    });
  }
  delete(id: string) {
    return this.http.delete(environment.api.URL+`api/vendors/vendor/${id}`, {
      headers: this.getHeaders()
    });
  }
  getImageToBase64(payload: any) {
    return this.http.post(environment.api.URL+'api/vendors/uploadImgToBase64', payload, {
      headers: this.getHeaders()
    });
  }

  uploadXlsFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(environment.api.URL+'api/vendors/upload/excel', formData, {
      headers: this.getFormDataHeaders()
    });
  }

  getImageBase64(payload: any) {
    const url = environment.api.URL+ 'api/users/uploadImgToBase64';
    return this.http.post(url, payload, {
      headers: this.getHeaders(),
    })
  }
}
