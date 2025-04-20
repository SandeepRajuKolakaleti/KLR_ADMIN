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
		return this.http.post(this.API_URL+ 'api/users/register', options).pipe(map(data => {
			return data;
		}));
	}

	getUserInformation() {
		const CrApiSessionStorage = this.storageService.get('ApiSession');
		return this.http.get(this.API_URL+ 'api/users/UserInfo', {
			headers: this.getAuthorizationHeaders(CrApiSessionStorage),
		});
	}

	resetPassword(options: any) {
		const CrApiSessionStorage = this.storageService.get('ApiSession');
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
			headers.Authorization = data.token_type + ' ' + data.access_token_local;
		}
		return headers;
	}

}
