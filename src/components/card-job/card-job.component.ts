import { Component, Input, OnInit } from '@angular/core';
import Jobs from '../../models/Jobs';
import { AuthService } from '../../services/auth-service.service';
import { NotificationService } from '../../services/notification-service.service';
import { EmployerseService } from '../../services/employerse.service';
import { employerse } from '../../models/employerse';
import employees from '../../models/employees';
import { EmployeesService } from '../../services/employees.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { JobsService } from '../../services/jobs.service';

@Component({
  selector: 'app-card-job',
  standalone: true,
  imports: [],
  templateUrl: './card-job.component.html',
  styleUrl: './card-job.component.scss'
})
export class CardJobComponent implements OnInit{
  list_employerse!:employerse[];
isLoggedIn: Number |null= -1;
current_employee!:employees;
isLoading = false;
progress = 0;


  ngOnInit(): void {
      const savedEmployee = this.localStorageService.getItemWithExpiry("Employee");
      if (savedEmployee) {
        let employeeObject= savedEmployee.value;

       this.current_employee=new employees(employeeObject.id,employeeObject.password,employeeObject.mail,employeeObject.first_name,employeeObject.last_name,employeeObject.birth_date,employeeObject.phone,employeeObject.resume)
      }
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.serv_employerse.get_all().subscribe((x:employerse[])=>{
  this.list_employerse=x;
    });
    
   
  }

@Input()
job!:Jobs

constructor(private authService: AuthService,private notificationService:NotificationService,private serv_employerse:EmployerseService,private localStorageService:LocalStorageService,private serv_job:JobsService) {}


startLoading() {
  this.isLoading = true;
  this.progress = 0;
  const step = 5; // תוסיפי פחות כל פעם

  this.loadingInterval = setInterval(() => {
    if (this.progress < 90) { // לא תגיע ל-100 לבד, מחכה לסיום
      this.progress += step;
    }
  }, 300); // זמן קצר יותר
}
loadingInterval: any;
stopLoading() {
  clearInterval(this.loadingInterval);
  this.progress = 100; // מסיים טעינה
  this.isLoading = false;
}
buttonDisabled: boolean = false;

Send_Resume(job: Jobs) {

  if (this.isLoggedIn==2) {
    try {
      this.buttonDisabled = true; // נועל את הכפתור מיד
      let mail = this.list_employerse.filter(x => x.idManager == job.employer)[0].mail;
      this.startLoading(); // מתחיל טעינה

      this.serv_job.send_resum(job, mail, this.current_employee).subscribe({
        next: (x: any) => {
          // עדכון ה-employees_send
       
          if (!job.employees_send.includes(this.current_employee.id)) {
            job.employees_send.push(this.current_employee.id);
            this.serv_job.setJob_Send_Resum(this.current_employee.id,job);
         
          }
        },
        error: (err) => {
          console.error('שגיאה', err);
          this.notificationService.showPopup("error", "שגיאה בשליחת קו״ח", "נסה שוב");
        },
        complete: () => { 
           job.jobSentStatus=false;
          // כאן עוצרים את הטעינה ומשחררים כפתור
          this.stopLoading();
          this.buttonDisabled = false;
        }
      });
    } catch (err) {
      console.error('שגיאה כללית', err);
      this.buttonDisabled = false;
      this.stopLoading();
    }
  } else {
    this.notificationService.showPopup("error", "אינך מחובר למערכת", "אנא התחבר למערכת");
  }
}
}
