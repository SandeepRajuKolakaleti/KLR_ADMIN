import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	API_URL = environment.api.URL;
	isUserAuthenticated = false;
	private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(private http: HttpClient,
		private commonService: CommonService,
		private storageService: StorageService) { }

	get isUserLoggedIn() {
		return this.commonService.isUserLoggedIn$;
	}

	public isAuthenticated(): boolean {
		return this.commonService.isAuthenticated();
	}

	public setAuthenticated(value: boolean) {
		this.commonService.setAuthenticated(value);
	}

	loginApiToken(options: { email: string; password: string }): Observable<any> {
		return this.http.post(this.API_URL+ 'api/users/login', options).pipe(map(data => {
			return data;
		}));
	}

	registerApi(options: any): Observable<any> {
        const blob = new Blob([options.file.buffer], { type: options.file.mimetype });
        const formData = new FormData();
        formData.append('image', options.image || '');
        formData.append('name', options.name);
        formData.append('email', options.email);
        formData.append('password', options.password);
        formData.append('phonenumber', options.phonenumber || '');
        formData.append('userRole', options.userRole);
        formData.append('permissionId', options.permissionId ? String(options.permissionId) : '');
        formData.append('permissionName', options.permissionName ? String(options.permissionName) : '');
        formData.append('address', options.address ? String(options.address) : '');
        formData.append('birthday', options.birthday ? String(options.birthday) : '');
        formData.append('file', blob, options.file.originalname);
        return this.http.post(this.API_URL + 'api/users/register', formData,{ 
            headers: { 
            }
        }).pipe(
			map(response => (response as any).data)
		);
	}

	updateUserApi(options: any): Observable<any> {
        const blob = new Blob([options.file.buffer], { type: options.file.mimetype });
        const formData = new FormData();
        formData.append('image', options.image || '');
        formData.append('name', options.name);
        formData.append('email', options.email);
        formData.append('password', options.password);
        formData.append('phonenumber', options.phonenumber || '');
        formData.append('userRole', options.userRole);
        formData.append('permissionId', options.permissionId ? String(options.permissionId) : '');
        formData.append('permissionName', options.permissionName ? String(options.permissionName) : '');
		formData.append('Id', options.Id ? String(options.Id) : '');
        formData.append('address', options.address ? String(options.address) : '');
        formData.append('birthday', options.birthday ? String(options.birthday) : '');
        formData.append('file', blob, options.file.originalname);
        return this.http.post(this.API_URL + 'api/users/update', formData,{ 
            headers: { 
            }
        }).pipe(
			map(response => (response as any).data)
		);
	}

	getUserInformation() {
		const CrApiSessionStorage = this.storageService.get('ApiToken');
		return this.http.get(this.API_URL+ 'api/users/profile/'+CrApiSessionStorage.id, {
			headers: this.getAuthorizationHeaders(CrApiSessionStorage),
		});
	}

	resetPassword(options: any) {
		const CrApiSessionStorage = this.storageService.get('ApiToken');
		return this.http.post(this.API_URL + 'api/users/resetPassword', options, {
		  headers: this.getAuthorizationHeaders(CrApiSessionStorage),
		}).pipe(map((response: any) => {
			return response;
		  }, (error: any) => {
			return error;
		  })
		);
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
