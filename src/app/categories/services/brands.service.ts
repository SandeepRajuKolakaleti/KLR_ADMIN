import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../app/shared/services/storage/storage.service';
import { environment } from '../../../environments/environment';
import { Brand } from '../components/brands/brands.component';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor(private http: HttpClient, private storageService: StorageService) { }
  
    getAll(): Observable<Brand[]> {
      const url = environment.api.URL+ 'api/brands/getAll';
      const CrApiSessionStorage = this.storageService.get('ApiToken');
      return this.http.get<Brand[]>(url, {
        headers: this.getAuthorizationHeaders(CrApiSessionStorage),
      });
    }
  
    create(formData: FormData) {
      const url = environment.api.URL+ 'api/brands/create-brand';
      const CrApiSessionStorage = this.storageService.get('ApiToken');
      return this.http.post(url, formData, {
        headers: this.getAuthorizationHeaders(CrApiSessionStorage),
      })
    }
  
    
    getImageBase64(payload: any) {
      const url = environment.api.URL+ 'api/products/uploadImgToBase64';
      const CrApiSessionStorage = this.storageService.get('ApiToken');
      return this.http.post(url, payload, {
        headers: this.getAuthorizationHeaders(CrApiSessionStorage),
      })
    }
  
    update(payload: FormData) {
      const url = environment.api.URL+ 'api/brands/update-brand';
      const CrApiSessionStorage = this.storageService.get('ApiToken');
      return this.http.post(url, payload, {
        headers: this.getAuthorizationHeaders(CrApiSessionStorage),
      })
    }
  
    delete(Id: string) {
      const url = environment.api.URL+ 'api/brands/brand/'+ Id;
      const CrApiSessionStorage = this.storageService.get('ApiToken');
      return this.http.delete(url, {
        headers: this.getAuthorizationHeaders(CrApiSessionStorage),
      });
    }
  
    private getAuthorizationHeaders(data: any) {
      const headers = {
        Authorization: '',
      };
      if (data && data !== '') {
        headers.Authorization = 'Bearer ' + data.access_token_local;
      }
      return headers;
    }
}
