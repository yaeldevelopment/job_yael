import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Jobs from '../models/Jobs';
import  apiURL  from '../models/api';
import { BehaviorSubject, Observable } from 'rxjs';
import employees from '../models/employees';
@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private api:string="";
  constructor(private http:HttpClient) { 
    this.api=apiURL+'api/';
    const jobsString = localStorage.getItem('jobs');
   
  }
  private JobsSubject = new BehaviorSubject<Jobs[]>( []); // משתנה שמשתנה לכל משתמש
  Jobs$ = this.JobsSubject.asObservable(); // חשיפת הנתונים כ-Observable
  getJobs() {
    return this. Jobs$;
  }
  setJob_Send_Resum(updatedJob: Jobs) {
    const currentJobs = this.JobsSubject.value;
    if (currentJobs) {
      const updatedJobs = currentJobs.map(job =>
        job.Id === updatedJob.Id ? updatedJob : job
      );
      this.JobsSubject.next(updatedJobs);
      // עדכון ה-LocalStorage

    }
  }

  setJob(Jobs: Jobs[]) {
    this.JobsSubject.next(Jobs) ;
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
