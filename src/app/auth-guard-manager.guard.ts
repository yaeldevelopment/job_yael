import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardManager implements CanActivate {
  constructor(private router: Router,private localStorageService:LocalStorageService) {}

  canActivate(): boolean {
    const isAuthenticated = !!this.localStorageService.getItemWithExpiry('Employerse'); // בדיקת התחברות
    if (!isAuthenticated) {
     
      this.router.navigate( ['/משרות']); // הפניה לדף התחברות במקרה שהמשתמש לא מחובר
      return false;
    }
  
    return true;
  }
}
