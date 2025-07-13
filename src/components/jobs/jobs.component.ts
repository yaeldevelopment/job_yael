import { Component, OnInit } from '@angular/core';
import { JobsService } from '../../services/jobs.service';
import { CardJobComponent } from '../card-job/card-job.component';
import { LoadingComponent } from '../loading/loading.component';
import { NgxPaginationModule } from 'ngx-pagination';
import employees from '../../models/employees';
import { LocalStorageService } from '../../services/local-storage.service';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Job } from '../../models/Jobs';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CardJobComponent,
    LoadingComponent,
    NgxPaginationModule,
    AsyncPipe
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent implements OnInit {
  isLoading: boolean = true;
  jobs: Job[] = [];
  currentPage: number = 1;
  Jobs$!: Observable<Job[]>;
  current_employee?: employees;

  constructor(
    private servjobs: JobsService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    try {
      const savedEmployee = this.localStorageService.getItemWithExpiry("Employee");
      if (savedEmployee?.value) {
        const e = savedEmployee.value;
        this.current_employee = new employees(
          e.id,
          '', // לא טוענים סיסמה
          e.mail,
          e.first_name,
          e.last_name,
          e.birth_date,
          e.phone,
          e.resume
        );
      }
    } catch {
      this.current_employee = undefined;
    }

this.servjobs.get_all_jobs().subscribe({
  next: (data: Job[]) => {
    this.isLoading = false;

    if (Array.isArray(data) && data.length > 0) {
      // מיון לפי תאריך פרסום בסדר יורד
      data.sort((a, b) => {
        const dateA = new Date(a.publication_date).getTime();
        const dateB = new Date(b.publication_date).getTime();
        return dateB - dateA;
      });

      data.forEach(job => {
        job.jobSentStatus = this.checkIfEmployeeAlreadySent(job);
      });

      this.servjobs.setJob(data);
    }

    this.Jobs$ = this.servjobs.getJobs();
  },
  error: () => {
    this.isLoading = false;
    this.Jobs$ = of([]); // מחזיר מערך ריק במקום להפיל את הדף
  }
});

  }

  checkIfEmployeeAlreadySent(job: Job): boolean {
    if (!this.current_employee) return true;
    return !(job.employees_send?.includes(this.current_employee.id));
  }
}
