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
  }
  private JobsSubject = new BehaviorSubject<Jobs[]|null>( null); // משתנה שמשתנה לכל משתמש
  Jobs$ = this.JobsSubject.asObservable(); // חשיפת הנתונים כ-Observable
  getJobs() {
    return this. Jobs$;
  }
  setJobs(Jobs: Jobs[]) {
 
    this.JobsSubject.next(Jobs);
  }
  setJob_Send_Resum(updatedJob: Jobs) {
    // קבלת הערך הנוכחי מה-BehaviorSubject
    const currentJobs = this.JobsSubject.value;
  
    if (currentJobs) {
      // מציאת המיקום של ה-Job לפי id (או מזהה אחר ייחודי)
      const updatedJobs = currentJobs.map(job =>
        job.Id === updatedJob.Id ? updatedJob : job
      );
  
      // עדכון ה-BehaviorSubject עם המערך החדש
      this.JobsSubject.next(updatedJobs);
    }
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
