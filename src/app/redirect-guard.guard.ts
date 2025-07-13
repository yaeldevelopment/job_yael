// redirect.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
@Injectable({ providedIn: 'root' })
export class RedirectGuard implements CanActivate {
  constructor(private router: Router,private localStorageService:LocalStorageService) {}

  canActivate(): boolean {

    const isAuthenticated = !!this.localStorageService.getItemWithExpiry('Employee')||!!this.localStorageService.getItemWithExpiry('Employerse');

    if (!isAuthenticated) {
      this.router.navigate(['/משרות']); // הפניה לדף התחברות במקרה שהמשתמש לא מחובר
      return false;
    }
    const targetRoute = !!this.localStorageService.getItemWithExpiry('Employee') ? '/משרות': '/ניהול-משרות';

    this.router.navigate([targetRoute]);
    return false;
  }
}
