import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import  { Job, JobBatchRequest } from '../models/Jobs';
import  apiURL  from '../models/api';
import { BehaviorSubject, Observable } from 'rxjs';
import employees from '../models/employees';
@Injectable({
  providedIn: 'root'
})
export class JobsService {
  addJob(newJob: Job) {
      return this.http.delete<any>(this.api+`/deleteById/${newJob}`);
  }
  private api:string="";
  constructor(private http:HttpClient) { 
    this.api=apiURL+'api/Jobs';
    const jobsString = localStorage.getItem('jobs');
   
  }
  private JobsSubject = new BehaviorSubject<Job[]>( []); // משתנה שמשתנה לכל משתמש
  Jobs$ = this.JobsSubject.asObservable(); // חשיפת הנתונים כ-Observable
  getJobs() {
    return this. Jobs$;
  }
  setJob_Send_Resum(id:string,updatedJob: Job) {
    const currentJobs = this.JobsSubject.value;
    
    if (currentJobs) {
      for(let item of currentJobs){
        item.jobSentStatus=!(item.employees_send?.includes(id));;   
      }
      this.JobsSubject.next(currentJobs);
    }
  }
  
  
  

  setJob(Jobs: Job[]) {
    this.JobsSubject.next(Jobs) ;
  }

  get_all_jobs():Observable<Job[]>{
      
    return this.http.get<Job[]>(this.api);

  }
  deleteJob(id:string){
        return this.http.delete<any>(this.api+`/deleteById/${id}`);
  }

   send_resum(job:Job,mail:string,employee:employees):Observable<any>{
   const  FormData =
    {
  job ,
  mail ,
      employee
    }
    return this.http.post<any>(this.api+"/Send_Resum",FormData);
      }
 
  batch(req: JobBatchRequest): Observable<void> {
    return this.http.post<void>(`${this.api}/batch`, req);
  }
}
