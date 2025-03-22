import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn$.next(this.checkLoginStatus());
    }
  }

  setItemWithExpiry(key: string, value: any, ttlOrExpiry: number, isAbsoluteExpiry: boolean = false) {
    if (!isPlatformBrowser(this.platformId)) return;
  
    const now = new Date();
    const expiry = isAbsoluteExpiry ? ttlOrExpiry : now.getTime() + ttlOrExpiry;
  
    const item = {
      value: value,
      expiry: expiry
    };
  
    localStorage.setItem(key, JSON.stringify(item));
    this.isLoggedIn$.next(true);
  }
  
  getItemWithExpiry(key: string) {
    if (!isPlatformBrowser(this.platformId)) return null;
  
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      this.isLoggedIn$.next(false);
      return null;
    }
  
    const item = JSON.parse(itemStr);
    const now = new Date();
  
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      this.isLoggedIn$.next(false);
      return null;
    }
  
    return {
      value: item.value, // כבר אובייקט
      expiry: item.expiry
    };
  }

  removeItem(key: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(key);
    this.isLoggedIn$.next(false);
  }

  checkLoginStatus(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return !!this.getItemWithExpiry('Employee');
  }
}
