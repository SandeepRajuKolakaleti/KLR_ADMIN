import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../app/shared/services/storage/storage.service';
import { environment } from '../../../environments/environment';
import { SubCategory } from '../components/sub-categories/sub-categories.component';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  constructor(private http: HttpClient, private storageService: StorageService) { }
  getAll(offset: number = 0, limit: number = 10): Observable<SubCategory[]> {
    const url = environment.api.URL+ 'api/sub-categories/getAll';
    const CrApiSessionStorage = this.storageService.get('ApiToken');
    return this.http.get<SubCategory[]>(url, {
      headers: this.getAuthorizationHeaders(CrApiSessionStorage),
      params: {
        offset: offset,
        limit: limit
      }
    });
  }

  create(formData: FormData) {
    const url = environment.api.URL+ 'api/sub-categories/create-subcategory';
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
    const url = environment.api.URL+ 'api/sub-categories/update-subcategory';
    const CrApiSessionStorage = this.storageService.get('ApiToken');
    return this.http.post(url, payload, {
      headers: this.getAuthorizationHeaders(CrApiSessionStorage),
    })
  }

  getSubCategoriesByCategoryId(Id: number): Observable<SubCategory> {
    const url = environment.api.URL+ 'api/sub-categories/category/'+ Id;
    const CrApiSessionStorage = this.storageService.get('ApiToken');
    return this.http.get<SubCategory>(url, {
      headers: this.getAuthorizationHeaders(CrApiSessionStorage),
    });
  }

  delete(Id: string) {
    const url = environment.api.URL+ 'api/sub-categories/subCategory/'+ Id;
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
