import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<number>(3);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  
  private getInitialLoginState(): number {
    if (typeof window !== 'undefined' && window.localStorage) {    
         return localStorage.getItem('Employee') ? 2 : 1;
    }
    return 0;
  }
  
  constructor(private localStorageService: LocalStorageService) {
    const state = this.getInitialLoginState();
    this.isLoggedInSubject.next(state);
  }


  login() {
    if (typeof window !== 'undefined' && window.localStorage) {

    this.isLoggedInSubject.next(2);
    }

  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.clear();
    this.isLoggedInSubject.next(1);
    }

  }
}
