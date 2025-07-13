// 📁 tabel-employee.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Job, JobBatchRequest } from '../../models/Jobs';
import { RowEmployeeComponent } from '../row-employee/row-employee.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobsService } from '../../services/jobs.service';
import $ from 'jquery';

@Component({
  selector: 'app-tabel-employee',
  standalone: true,
  imports: [ReactiveFormsModule, RowEmployeeComponent],
  templateUrl: './tabel-employee.component.html',
  styleUrl: './tabel-employee.component.scss'
})
export class TabelEmployeeComponent implements OnInit {
  jobForm!: FormGroup;
  editingId: string | null = null;
  originalJobs: Job[] = [];
  list_jobs: Job[] = [];

  constructor(
    private servjobs: JobsService,
    private jobsSvc: JobsService,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.loadJobs();
    this.initForm();
  }

  private buildBatch(): JobBatchRequest {
    const clean = (job: Job): Job => {
      const clone = { ...job };
      delete (clone as any).__isNew;
      delete (clone as any).tempId;
      return clone;
    };

    const added = this.list_jobs.filter(j => j.__isNew).map(clean);
    const updated = this.list_jobs
      .filter(j => j.id && !j.__isNew && this.changed(j))
      .map(clean);
    const deleted = this.originalJobs
      .filter(o => !this.list_jobs.some(c => c.id === o.id))
      .map(o => o.id!);

    return {
      EmployerId: this.localStorageService.getItemWithExpiry("Employerse")?.value.id,
      added,
      updated,
      deleted
    };
  }

  parseDateToISO(dateStr: string): string {
    if (!dateStr) return '';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/');
      return new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];
    }
    return new Date(dateStr).toISOString().split('T')[0];
  }

  formatDate(value: any): string {
    if (!value) return '';
    const date = new Date(value);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  private changed(job: Job): boolean {
    const orig = this.originalJobs.find(o => o.id === job.id);
    if (!orig) return true;

    const normalize = (j: Job) => ({
      ...j,
      id: undefined,
      salary: j.salary || '',
      job_location: j.job_location?.join(',') || ''
    });

    return JSON.stringify(normalize(orig)) !== JSON.stringify(normalize(job));
  }

  saveChanges() {
    document.querySelector("button.save_changes")?.setAttribute("disabled", "true");

    const batch = this.buildBatch();

    if (!batch.added.length && !batch.updated.length && !batch.deleted.length) {
      alert('אין שינויים לשמירה');
      document.querySelector("button.save_changes")?.removeAttribute("disabled");
      return;
    }

    this.jobsSvc.batch(batch).subscribe({
      next: () => {
        alert("נשמר בהצלחה");

        this.servjobs.get_all_jobs().subscribe({
          next: (jobs: Job[]) => {
            let filteredJobs = jobs.filter(job =>
              String(job.employer) === String(this.localStorageService.getItemWithExpiry("Employerse")?.value.id)
            );

            this.originalJobs = JSON.parse(JSON.stringify(filteredJobs));
            this.list_jobs = JSON.parse(JSON.stringify(filteredJobs));
            this.localStorageService.setItemWithExpiry("JobsByEmployer", filteredJobs, 86400000);
          },
          error: (err) => {
            console.error('שגיאה בקבלת משרות:', err);
            $(".message_tey")?.text("שגיאה בקבלת משרות");
          }
        });

        document.querySelector("button.save_changes")?.removeAttribute("disabled");
      },
      error: err => {
        alert('שגיאה');
        document.querySelector("button.save_changes")?.removeAttribute("disabled");
      }
    });
  }

  @Output() saveAll = new EventEmitter<Job[]>();

  loadJobs() {
    this.list_jobs = this.localStorageService.getItemWithExpiry("JobsByEmployer")?.value || [];
    this.originalJobs = JSON.parse(JSON.stringify(this.list_jobs));
  }

  initForm() {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      componay: ['', Validators.required],
      publication_date: [this.formatDate(new Date())],
      job_location: ['', Validators.required],
      job_type: ['', Validators.required],
      salary: [''],
      additional_conditions: ['', Validators.required],
      html_word: ['', Validators.required],
    });
  }

  editJob(job: Job) {
    this.editingId = job.id || job.tempId || null;
    const formattedDate = this.formatDate(job.publication_date);

    this.jobForm.patchValue({
      ...job,
      publication_date: formattedDate,
      job_location: job.job_location?.join(', ') || ''
    });
  }

  deleteJobObj(jobToDelete: Job) {
    this.jobForm.reset();
    const index = this.list_jobs.indexOf(jobToDelete);
    if (index > -1) this.list_jobs.splice(index, 1);
    if (this.editingId === jobToDelete.id || this.editingId === jobToDelete.tempId) {
      this.editingId = null;
    }
  }

  addNewJob() {
    this.editingId = null;
    this.jobForm.reset();
    this.jobForm.patchValue({ publication_date: this.formatDate(new Date()) });
  }

  submitForm() {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    const f = this.jobForm.value;
    const job: Job = {
      ...f,
      publication_date: this.parseDateToISO(f.publication_date),
      job_location: f.job_location.split(',').map((s: string) => s.trim())
    };

    if (!f.salary || f.salary.toString().trim() === '') {
      delete job.salary;
    }

    if (this.editingId) {
      const idx = this.list_jobs.findIndex(j =>
        (j.id && j.id === this.editingId) ||
        (!j.id && j.tempId === this.editingId)
      );
      if (idx !== -1) {
        this.list_jobs[idx] = {
          ...job,
          id: this.list_jobs[idx].id,
          tempId: this.list_jobs[idx].tempId
        };
      }
    } else {
      job.__isNew = true;
      job.tempId = 'tmp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 10);
      this.list_jobs.push(job);
    }

    this.jobForm.reset();
    this.jobForm.patchValue({ publication_date: this.formatDate(new Date()) });
    this.editingId = null;
  }
}
