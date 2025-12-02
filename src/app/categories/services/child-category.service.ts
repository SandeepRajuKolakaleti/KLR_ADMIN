import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../../app/shared/services/storage/storage.service';
import { ChildCategory } from '../components/child-categories/child-categories.component';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChildCategoryService {

  constructor(private http: HttpClient, private storageService: StorageService) { }
  getAll(offset: number = 0, limit: number = 10): Observable<ChildCategory[]> {
    const url = environment.api.URL+ 'api/child-categories/getAll';
    const CrApiSessionStorage = this.storageService.get('ApiToken');
    return this.http.get<ChildCategory[]>(url, {
      headers: this.getAuthorizationHeaders(CrApiSessionStorage),
      params: {
        offset: offset,
        limit: limit
      }
    });
  }

  create(formData: FormData) {
    const url = environment.api.URL+ 'api/child-categories/create-child-category';
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
    const url = environment.api.URL+ 'api/child-categories/update-child-category';
    const CrApiSessionStorage = this.storageService.get('ApiToken');
    return this.http.post(url, payload, {
      headers: this.getAuthorizationHeaders(CrApiSessionStorage),
    })
  }

  getChildCategoriesById(Id: number): Observable<ChildCategory> {
    const url = environment.api.URL+ 'api/child-categories/childCategory/'+ Id;
    const CrApiSessionStorage = this.storageService.get('ApiToken');
    return this.http.get<ChildCategory>(url, {
      headers: this.getAuthorizationHeaders(CrApiSessionStorage),
    });
  }

  delete(Id: string) {
    const url = environment.api.URL+ 'api/child-categories/child-category/'+ Id;
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
