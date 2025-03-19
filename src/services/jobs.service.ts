import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Jobs from '../models/Jobs';
import  apiURL  from '../models/api';
import { Observable } from 'rxjs';
import employees from '../models/employees';
@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private api:string="";
  constructor(private http:HttpClient) { 
    this.api=apiURL+'api/';
  }
  get_all_jobs():Observable<Jobs[]>{
      
    return this.http.get<Jobs[]>(this.api+'Jobs');
  }
   send_resum(job:Jobs,mail:string,employee:employees):Observable<any>{
   const  FormData =
    {
  job ,
  mail ,
      employee
    }
    return this.http.post<any>(this.api+"Jobs/Send_Resum",FormData);
      }
}
