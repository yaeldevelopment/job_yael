import { Component } from '@angular/core';
import employees from '../../models/employees';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UploadService } from '../../services/upload-service.service';
import { HttpClient } from '@angular/common/http';
import server from '../../models/api';
import { LocalStorageService } from '../../services/local-storage.service';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
employee!:employees;
safeResumeUrl: SafeResourceUrl = '';
selectedFile: File | null = null; // קובץ שהמשתמש בחר
uploadedFileUrl: SafeResourceUrl | null = null; // נתיב הקובץ שיוצג למשתמש
existingFileHash: string | null = null; // ה-Hash של הקובץ הקיים
resumeUrl: string = '';
current_employee!:employees; 
isUploading: boolean = false;
ngOnInit() {
  if (this.employee.resume) {
    this.resumeUrl = this.employee.resume + '?v=' + new Date().getTime();

  }
}

constructor( public sanitizer: DomSanitizer,private uploadService:UploadService,private http: HttpClient,private localStorageService:LocalStorageService){
  const savedEmployee = this.localStorageService.getItemWithExpiry("Employee");
  if (savedEmployee) {
    const employeeObject = JSON.parse(savedEmployee);
   this.employee=new employees(employeeObject._id,employeeObject.password,employeeObject.mail,employeeObject.first_name,employeeObject.last_name,employeeObject.birth_date,employeeObject.phone,employeeObject.resume)

}}

// כאשר המשתמש בוחר קובץ
onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (!file) return;

  // בדיקה אם הקובץ החדש זהה לקובץ הקיים
  this.http.get(this.employee.resume, { responseType: 'blob' }).subscribe({
    next: async (fileBlob) => {
      
    },
    error: () => console.warn('⚠️ לא נמצא קובץ קיים למשתמש')
  });


  this.selectedFile = file;
}
async calculateHash(file: Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}
// העלאת קובץ חדש
   
  uploadFile() {
    if (!this.selectedFile) return;

    this.isUploading = true; // נועל את הכפתור
    if (!this.selectedFile || !this.employee.mail) {
      alert('❌ יש להזין אימייל ולבחור קובץ להעלאה.');
      return;
    }
  

const allowedTypes = [
  "application/pdf",

];

if (!allowedTypes.includes(this.selectedFile.type)) {
  alert('❌ יש להעלות קובץ מהסיומות הבאות: .pdf');
  return;
}


this.uploadService.uploadPDF(this.selectedFile, this.employee.mail).subscribe({
  next: (response: { message: string; path: string }) => {
    // מוסיפים query param רנדומלי כדי לעקוף cache
    this.resumeUrl = response.path + '?v=' + new Date().getTime();

    // עדכון הנתיב לקובץ ב-employee
    this.employee.resume = response.path;

    // קבלת האובייקט הקודם מה-localStorage
    const employeeData = this.localStorageService.getItemWithExpiry("Employee");

    if (employeeData) {
      const expiryTime = JSON.parse(localStorage.getItem("Employee")!).expiry;
    
      const updatedEmployee = { ...employeeData, resume: response.path };
    
      // שמירה מחדש עם expiry הקודם:
      this.localStorageService.setItemWithExpiry("Employee", updatedEmployee, expiryTime, true);
    }
    

    this.selectedFile = null;
  },

  error: (error) => {
    console.error("Error uploading file:", error);
  },

  complete: () => {
    // שחרור הכפתור לאחר סיום (בהצלחה או כישלון)
    this.isUploading = false;
  }
});
}


}
