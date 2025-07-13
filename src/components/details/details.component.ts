import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import employees from '../../models/employees';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UploadService } from '../../services/upload-service.service';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../../services/local-storage.service';
import { employerse } from '../../models/employerse';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  employee: employees | null = null;
  employerse: employerse | null = null;
  resumeUrl: string = '';
  selectedFile: File | null = null;
  fileInputKey = 0;
  isUploading = false;

  constructor(
    public sanitizer: DomSanitizer,
    private uploadService: UploadService,
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    const savedEmployee = this.localStorageService.getItemWithExpiry("Employee");
    const savedEmployerse = this.localStorageService.getItemWithExpiry("Employerse");

    if (savedEmployee?.value) {
      const e = savedEmployee.value;
      this.employee = new employees(
        e.id,
        '', // לא שומרים סיסמה
        e.mail,
        e.first_name,
        e.last_name,
        e.birth_date,
        e.phone,
        e.resume
      );
    } else if (savedEmployerse?.value) {
      const e = savedEmployerse.value;
      this.employerse = new employerse(
        e.id,
        e.mail,
        '', // לא שומרים סיסמה
        e.phone,
        e.address,
        e.first_name,
        e.last_name,
        e.birth_date
      );
    }
  }

  ngOnInit(): void {
    if (this.employee?.resume) {
      this.resumeUrl = this.employee.resume + '?v=' + new Date().getTime();
    }
  }

  get safeResumeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.resumeUrl || '');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      this.selectedFile = file;
    }
  }

  uploadFile(): void {
    if (!this.selectedFile || !this.employee?.mail) {
      alert('❌ יש להתחבר עם מייל ולבחור קובץ PDF.');
      return;
    }

    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(this.selectedFile.type)) {
      alert('❌ ניתן להעלות רק קובץ PDF.');
      return;
    }

    this.isUploading = true;

    this.uploadService.uploadPDF(this.selectedFile, this.employee.mail).subscribe({
      next: (response: { message: string; path: string }) => {
        if (!response?.path) {
          alert('⚠️ ההעלאה נכשלה.');
          return;
        }

        this.resumeUrl = response.path + '?v=' + new Date().getTime();
        this.employee!.resume = response.path;

        const oldData = this.localStorageService.getItemWithExpiry("Employee");
        const expiry = oldData?.expiry;

        if (expiry) {
          const cleanEmployee = { ...this.employee, password: '' };
          this.localStorageService.setItemWithExpiry("Employee", cleanEmployee, expiry, true);
        }

        this.fileInputKey++;
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';
      },
      error: (err) => {
        console.error('שגיאה בהעלאה:', err);
        alert('❌ שגיאה בהעלאת קובץ, נסה שוב.');
      },
      complete: () => {
        this.isUploading = false;
      }
    });
  }
}
