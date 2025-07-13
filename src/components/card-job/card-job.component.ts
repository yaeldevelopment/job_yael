import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { NotificationService } from '../../services/notification-service.service';
import { EmployerseService } from '../../services/employerse.service';
import { employerse } from '../../models/employerse';
import employees from '../../models/employees';
import { EmployeesService } from '../../services/employees.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { JobsService } from '../../services/jobs.service';
import { Job } from '../../models/Jobs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-card-job',
  standalone: true,
  imports: [],
  templateUrl: './card-job.component.html',
  styleUrl: './card-job.component.scss'
})
export class CardJobComponent implements OnInit {
  list_employerse: employerse[] = [];
  isLoggedIn: number | null = -1;
  current_employee!: employees;
  isLoading = false;
  progress = 0;
  loadingInterval: any;
  buttonDisabled = false;

  @Input() job!: Job;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private serv_employerse: EmployerseService,
    private localStorageService: LocalStorageService,
    private serv_job: JobsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const savedEmployee = this.localStorageService.getItemWithExpiry('Employee');
    if (savedEmployee?.value) {
      const e = savedEmployee.value;
      this.current_employee = new employees(
        e.id, e.password, e.mail, e.first_name, e.last_name, e.birth_date, e.phone, e.resume
      );
    }

    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.serv_employerse.get_all().subscribe({
      next: (res) => this.list_employerse = res,
      error: (err) => {
        console.error('שגיאה בקבלת מעסיקים', err);
        this.notificationService.showPopup("error", "שגיאה בטעינת נתוני מעסיקים", "נסה שוב");
      }
    });
  }

  startLoading() {
    this.isLoading = true;
    this.progress = 0;
    const step = 5;

    this.loadingInterval = setInterval(() => {
      if (this.progress < 90) {
        this.progress += step;
      }
    }, 300);
  }

  stopLoading() {
    clearInterval(this.loadingInterval);
    this.progress = 100;
    this.isLoading = false;
  }

  sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  Send_Resume(job: Job) {
    if (this.isLoggedIn !== 2) {
      this.notificationService.showPopup("error", "אינך מחובר למערכת", "אנא התחבר למערכת");
      return;
    }

    if (!this.current_employee) {
      this.notificationService.showPopup("error", "התחברות נכשלה", "נסה שוב מאוחר יותר");
      return;
    }

    const employer = this.list_employerse.find(x => x.id === job.employer);
    if (!employer?.mail) {
      this.notificationService.showPopup("error", "שגיאה", "לא נמצא מייל מעסיק");
      return;
    }

    if (!Array.isArray(job.employees_send)) {
      job.employees_send = [];
    }

    this.buttonDisabled = true;
    this.startLoading();

    this.serv_job.send_resum(job, employer.mail, this.current_employee).subscribe({
      next: () => {
        if (!job.employees_send.includes(this.current_employee.id)) {
          job.employees_send.push(this.current_employee.id);
          this.serv_job.setJob_Send_Resum(this.current_employee.id, job);
        }
      },
      error: (err) => {
        console.error('שגיאה בשליחת קו״ח', err);
        this.notificationService.showPopup("error", "שגיאה בשליחת קו״ח", "נסה שוב");
      },
      complete: () => {
        job.jobSentStatus = false;
        this.stopLoading();
        this.buttonDisabled = false;
      }
    });
  }
}
