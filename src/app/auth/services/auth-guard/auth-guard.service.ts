import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

	constructor(private auth: AuthService, public router: Router, private storageService: StorageService) {}
	canActivate(): boolean {
		let crApiToken = this.storageService.get('ApiToken');
		if (!this.auth.isAuthenticated()) {
			if (crApiToken) {
				return true;
			}
			this.router.navigate(['login']);
			return false;
		}
		return true;
	}
}
