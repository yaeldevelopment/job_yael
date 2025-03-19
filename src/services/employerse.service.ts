import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { employerse } from '../models/employerse';
import  apiURL  from '../models/api';
@Injectable({
  providedIn: 'root'
})
export class EmployerseService {
  private api:string="";
  constructor(private http:HttpClient) { 
    this.api=apiURL+'api/';
  }

  get_all():Observable<employerse[]>{
return this.http.get<employerse[]>(this.api+"employerse");
  }
  
}
