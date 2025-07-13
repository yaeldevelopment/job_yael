import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { employerse } from '../models/employerse';
import employerse_login from '../models/employerse_login';
import  apiURL  from '../models/api';
import employee_login from '../models/employee_login';
@Injectable({
  providedIn: 'root'
})
export class EmployerseService {
  private api:string="";
  constructor(private http:HttpClient) { 
    this.api=apiURL+'api/employerse';
  }

  get_all():Observable<employerse[]>{
return this.http.get<employerse[]>(this.api);
  }
 getemployerse(x:employee_login):Observable<employerse>{
   return this.http.post<employerse>(this.api+'/getByEmployee',x);
  }
 getByemployerse(mail:string):Observable<employerse>{
return this.http.post<employerse>(this.api+`/getByemployerse?mail=${mail}`,null);
  }
post_employerse(e:employerse):Observable<employerse>{
  return this.http.post<employerse>(this.api+`/insertById`,e);
}
  reset_password(Email:string,NewPassword:string):Observable<any>{
        const requestBody = { Email, NewPassword };
    return this.http.post<any>(this.api+"/resetPassword",requestBody);
  }
}
