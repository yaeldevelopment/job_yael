import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import  apiURL  from '../models/api';
import { BehaviorSubject, Observable } from 'rxjs';
import employees from '../models/employees';
import employee_login from '../models/employee_login';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from './auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
 private api:string="";
 private employeeSubject = new BehaviorSubject<employees|null>( null); // משתנה שמשתנה לכל משתמש
 employee$ = this.employeeSubject.asObservable(); // חשיפת הנתונים כ-Observable
  constructor(private http:HttpClient,private authService:AuthService) {
    this.api=apiURL+'api/';
   }
  get_employee(x:employee_login):Observable<employees>{
   return this.http.post<employees>(this.api+'employees/getByEmployee',x);
  }
  get_employee_Id(mail:string):Observable<employees>{
 
    return this.http.post<employees>(this.api+`employees/getByEmployee_id?mail=${mail}`,null);
   }
  setEmployee(employee: employees) {
    
    this.employeeSubject.next(employee);
    this.authService.login();
    
  }
  

  // קבלת הנתונים של המשתמש הנוכחי
  getEmployee() {
    return this.employeeSubject.value;
  }

  post_employee(x:employees):Observable<any>{
    return this.http.post<any>(this.api+'employees/insertById',x);
   } 

   send_password(mail:string,Password:string):Observable<any>{
    const requestBody = { mail, Password };
    return this.http.post<any>(this.api+'employees/forgotPassword',requestBody);
   } 

   reset_password(Email:string,NewPassword:string):Observable<any>{
    const requestBody = { Email, NewPassword };
    return this.http.post<any>(this.api+'employees/resetPassword',requestBody);
   } 
}
