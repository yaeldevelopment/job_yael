import { Component, OnInit } from '@angular/core';
import { JobsService } from '../../services/jobs.service';
import Jobs from '../../models/Jobs';
import { CardJobComponent } from "../card-job/card-job.component";
import { LoadingComponent } from "../loading/loading.component";
import { NgxPaginationModule } from 'ngx-pagination';
import employees from '../../models/employees';
import { LocalStorageService } from '../../services/local-storage.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CardJobComponent, LoadingComponent,NgxPaginationModule,AsyncPipe],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent implements OnInit{
  isLoading:boolean=true;
  jobs!:Jobs[];
  items = Array.from({ length: 50 }, (_, i) => `פריט ${i + 1}`);
  currentPage = 1;
  Jobs$!:Observable<Jobs[]>;
  current_employee!:employees;
   ngOnInit(): void {
        const savedEmployee = this.localStorageService.getItemWithExpiry("Employee");
       
        if (savedEmployee) {

         let employeeObject= savedEmployee.value;
         this.current_employee=new employees(employeeObject.id,employeeObject.password,employeeObject.mail,employeeObject.first_name,employeeObject.last_name,employeeObject.birth_date,employeeObject.phone,employeeObject.resume)
        }
        this.servjobs.get_all_jobs().subscribe((data:Jobs[])=>{
  this.isLoading=false;
  if(data.length>0){

data.forEach(job => {
  job.jobSentStatus=this.checkIfEmployeeAlreadySent(job);

}); 

   this.servjobs.setJob(data);
 
  }
this.Jobs$=this.servjobs.getJobs();
})
      }
constructor(private servjobs:JobsService,private localStorageService:LocalStorageService){


}
checkIfEmployeeAlreadySent(job: Jobs): boolean {
  
  if (!this.current_employee) {
    return true;
  }
  return !(job.employees_send?.includes(this.current_employee.id)); // או כל לוגיקה שיש לך
}
}
