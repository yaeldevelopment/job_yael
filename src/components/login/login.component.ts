import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { EncryptionService } from '../../services/encryption-service.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import employees from '../../models/employees';
import { EmployeesService } from '../../services/employees.service';
import $ from 'jquery';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import employee_login from '../../models/employee_login';

import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import { animate, state, style, transition, trigger } from '@angular/animations';
import {  } from '@angular/platform-browser/animations';
import { UploadService } from '../../services/upload-service.service';
import server from '../../models/api';
import { NotificationService } from '../../services/notification-service.service';
import { LocalStorageService } from '../../services/local-storage.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule ,MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule  , // ✅ נדרש רק ב-Root Module
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('transitionMessages', [
      state('hidden', style({ 
        opacity: 0, 
        transform: 'translateY(-10px) scale(0.95)',
        color: 'gray' 
      })),
      state('visible', style({ 
        opacity: 1, 
        transform: 'translateY(0) scale(1)', 
        color: 'black' 
      })),
      transition('hidden <=> visible', animate('400ms ease-in-out'))
    ])
  ]
})
export class LoginComponent {
   count:number=0 
        onClose=()=>{
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });}
verifyCode() {
 if (this.verificationCode.get("Code")?.value==  this.localStorageService.getItemWithExpiry("pass"))
 {
  this.step=3;
 }
 else{
  this.count++;
  if( this.count>3){
   
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
    alert("כמות הפעיים שניסית נגמר")
  }
  $("#verification_msg").text("האימות נכשל");
 }

}
  selectedFile!:File ; 
  resetPasswordForm!:FormGroup;
  step:number=0;
  verificationCode!:FormGroup;
  onResetPassword() {

     this.employeesServ.reset_password( this.localStorageService.getItemWithExpiry("mail")!,this.resetPasswordForm.get("verification")?.value).subscribe({
      next: response => {
        
        this.localStorageService.setItemWithExpiry("Employee", JSON.stringify(response.user || ""),86400000);
        this.notificationService.showPopup('success', 'הצלחה!', 'הפעולה בוצעה בהצלחה.',this.onClose );

      },
      error: error => {
    
        this.notificationService.showError();
      }
    });
  }
  
  CreateUser() {
    $("button[type='submit']").attr("disabled","true");
    const allowedTypes = [
      "application/pdf",
    
    ];
    
    if (!allowedTypes.includes(this.selectedFile.type)) {
      alert('❌ יש להעלות קובץ מהסיומות הבאות: .pdf');
      return;
    }
      
    if (!this.selectedFile) {
      alert("לא נבחר קובץ קוח");
      return;
    }
    this.employeesServ.get_employee_Id(  this.CreateUserForm.get('email')?.value).subscribe(x=>{
   
      if(x!=null && x.id!=""){
        alert("המשתמש כבר קיים במערכת");   
          return;
      }
      else{
           this.uploadService.uploadPDF(this.selectedFile,  this.CreateUserForm.get('email')?.value).subscribe(
      (x: { message: string; path: string }) => {
        const resum = server.toString() + x.path; // מקבל את הנתיב מהשרת
  
  
        let e = new employees(
          "",
          this.CreateUserForm.get('password')?.value,
          this.CreateUserForm.get('email')?.value,
          this.CreateUserForm.get('first_name')?.value,
          this.CreateUserForm.get('last_name')?.value,
          this.CreateUserForm.get('birth_date')?.value,
          this.CreateUserForm.get('phone')?.value,
          resum
        );
  
        this.employeesServ.post_employee(e).subscribe(
          (e:employees) => {
            this.localStorageService.setItemWithExpiry("Employee", JSON.stringify(e || ""),86400000);

            this.router.navigate(['/']).then(() => {
              window.location.reload();
              
            this.notificationService.showPopup('success', 'המשתמש נוצר בהצלחה', 'ברוכים הבאים מקווים שתהנו' );
            });
          },
          (error) => console.error("Error saving employee:", error)
        );
      },
      (error) => console.error("Error uploading file:", error)
    );
      }
   
    
    })
 
  }
  
onFileSelected(event: any) {
  const file: File = event.target.files[0]; 

   if (!file) return;
   this.selectedFile=file;
 

}
openFileDialog(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  const fileInput = document.getElementById('resume') as HTMLInputElement;
  if (fileInput) {
    fileInput.click(); // פותח את חלון הבחירה של הקובץ
  }
}
forgotPasswordVisible = false; // משתנה ב-Component לניהול ההופעה של "שכחתי סיסמה"
  employee:employees|undefined=undefined;

  selectLoginType(type: number) {
    this.step = type;
  }
  async onSubmit() {
    $("button[type='submit']").attr("disabled", "true");
  
    this.employeesServ.get_employee(new employee_login(
      this.loginForm.get('email')?.value, 
      this.loginForm.get('password')?.value
    )).pipe(
      tap((data: employees | string) => {
    
        
        if (typeof data !== 'string') {
          this.employeesServ.setEmployee(data);
     
        } else {
     
          this.localStorageService.setItemWithExpiry("mail",   this.loginForm.get('email')?.value,86400000);
          this.step=2;
          $(".message_tey")?.text("סיסמה שגויה, נסה שוב או לחץ על 'שכחתי סיסמה'");
        }
      }),
      catchError((error) => {
        if (error.status === 401) { 
          // טיפול במקרה של סיסמה שגויה
          this.forgotPasswordVisible = true;
    
          this.localStorageService.setItemWithExpiry("mail",   this.loginForm.get('email')?.value,86400000);
          $(".message_tey")?.text("סיסמה שגויה, נסה שוב או לחץ על 'שכחתי סיסמה'");
        } else if (error.status === 404) { 
          $(".message_tey")?.text("משתמש זה אינו קיים");
        } else {
          $(".message_tey")?.text("שגיאה בלתי צפויה, נסה שוב מאוחר יותר");
        }
        return of(null); // מחזירים Observable ריק כדי שהזרימה לא תקרוס
      })
    )
    .subscribe(() => {
      if (this.employeesServ.getEmployee() != null) {
        $(".message_tey")?.text("");
        this.localStorageService.setItemWithExpiry("Employee", JSON.stringify(this.employeesServ.getEmployee() || ""),86400000);
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      }
    });
  }

  generateSecureRandomPassword(): string {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return (array[0] % 900000 + 100000).toString();
  }
  
  showForgotPasswordForm() {
    // הצגת טופס איפוס סיסמה
    let pass=this.generateSecureRandomPassword()
    this.localStorageService.setItemWithExpiry("pass",pass,86400000);
    this.employeesServ.send_password(this.localStorageService.getItemWithExpiry("mail")!,pass)
    .subscribe({
      next: response => {
        this.count=0;
        this.notificationService.showPopup("success","הסיסמא נשלחה למייל בהצלחה","אנא הכנס למייל ותבדוק מהו קוד האימות");
    
      },
      error: error => {
        this.notificationService.showError();
      }
    });
    this.step = 2; // הסתרת הכפתור לאחר הלחיצה

  }
minAgeValidator(minAge: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const birthDate = new Date(control.value);
    if (isNaN(birthDate.getTime())) {
      return { invalidDate: true };
    }

    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

    return birthDate <= minBirthDate ? null : { tooYoung: true };
  };}
  loginForm!:FormGroup;
  CreateUserForm!:FormGroup;  // ולידציה לסיסמה חזקה (דוגמא בסיסית)


  // בדיקת חוזק סיסמה (סינכרוני)
  strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[\W_]/.test(value);

    const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    return isValid ? null : { weakPassword: true };
  }

  // בדיקה אם הסיסמאות תואמות (סינכרוני)
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const verification = group.get('verification')?.value;
    return password && verification && password !== verification ? { passwordsNotMatching: true } : null;
  }
constructor(private notificationService:NotificationService,private fb:FormBuilder,private Encryption_Service:EncryptionService,private employeesServ:EmployeesService,private router: Router,private uploadService:UploadService,private localStorageService:LocalStorageService){
  this.resetPasswordForm = this.fb.group({
    password: ['', Validators.required],
    verification: ['', Validators.required]
  }
  ,{ validators: this.passwordMatchValidator } // ✅ וולידציה של התאמת הסיסמאות ברמת ה-FormGroup
);

  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]

  });
  this.CreateUserForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), this.strongPasswordValidator]], // ✅ העברת הוולידציה לכאן
    verification: ['', [Validators.required, Validators.minLength(6)]],
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    birth_date: ['', [Validators.required, this.minAgeValidator(18)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?\d{1,3}\d{9,15}$/)]],
    resume: ['', [Validators.required, Validators.minLength(6)]]
  }, 
  { validators: this.passwordMatchValidator } // ✅ וולידציה של התאמת הסיסמאות ברמת ה-FormGroup
  );

this.verificationCode  = this.fb.group({
  Code: ['', [Validators.required, Validators.min(6)]],

})
}


}
