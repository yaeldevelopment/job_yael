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
import { EmployerseService } from '../../services/employerse.service';
import employerse_login from '../../models/employerse_login';
import { employerse } from '../../models/employerse';
import { AuthService } from '../../services/auth-service.service';
import { JobsService } from '../../services/jobs.service';
import { Job } from '../../models/Jobs';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule ,MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule  ,CommonModule // ✅ נדרש רק ב-Root Module
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
 if (this.verificationCode.get("Code")?.value== this.Encryption_Service.decryptData( this.localStorageService.getItemWithExpiry("pass")?.value))
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

confirmPasswordVisible = false;
toggleConfirmPasswordVisibility() {
  this.confirmPasswordVisible = !this.confirmPasswordVisible;
}
  selectedFile!:File ; 
  resetPasswordForm!:FormGroup;
  step:number=0;
  verificationCode!:FormGroup;
  onResetPassword() {
      const isEmployer = this.loginForm.get('is_employer')?.value;

  if (isEmployer > 0) {
     this.employerseService.reset_password( this.localStorageService.getItemWithExpiry("mail")?.value!,this.resetPasswordForm.get("verification")?.value).subscribe({
      next: response => {
        
  
         this.localStorageService.setItemWithExpiry("Employerse",  response.user, 86400000);
    

             this.servjobs.get_all_jobs().subscribe({
          next: (jobs: Job[]) => {
 
            let filteredJobs = jobs.filter(job => String(job.employer) === String(response.user.id));
   

            this.localStorageService.setItemWithExpiry("JobsByEmployer", filteredJobs, 86400000);

            $(".message_tey")?.text("");
            this.authService.login();
            this.router.navigate(['/']).then(() => {
              window.location.reload();
            });
          },
          error: (err) => {
            console.error('שגיאה בקבלת משרות:', err);
            $(".message_tey")?.text("שגיאה בקבלת משרות");
          }
        });
        this.notificationService.showPopup('success', 'הצלחת', 'הסיסמא שונתה בהצלחה',this.onClose );

      },
      error: error => {
    
        this.notificationService.showError();
      }
    });
  }
  else{
        this.employeesServ.reset_password( this.localStorageService.getItemWithExpiry("mail")?.value!,this.resetPasswordForm.get("verification")?.value).subscribe({
      next: response => {
        
        this.localStorageService.setItemWithExpiry("Employee", response.user || "",86400000);
        this.notificationService.showPopup('success', 'הצלחת', 'הסיסמא שונתה בהצלחה',this.onClose );

      },
      error: error => {
    
        this.notificationService.showError();
      }
    });
  }
  }
  
  CreateUser() {
   
    $("button[type='submit']").attr("disabled","true");
 if (this.CreateUserForm.get("is_employer")?.value > 0) {
  this.employerseService.getByemployerse(this.CreateUserForm.get('email')?.value).subscribe({
    next: x => {
      if (x && x.id) {
        alert("המשתמש כבר קיים במערכת");
        return;
      }

      // המשתמש לא קיים - ניצור חדש
      const e = new employerse(
        "", // id ייווצר בשרת

        this.CreateUserForm.get('email')?.value,
                this.CreateUserForm.get('password')?.value,
        this.CreateUserForm.get('phone')?.value,
        this.CreateUserForm.get('address')?.value,
        this.CreateUserForm.get('first_name')?.value,
        this.CreateUserForm.get('last_name')?.value,
        this.CreateUserForm.get('birth_date')?.value
      );

      this.employerseService.post_employerse(e).subscribe({
        next: (createdEmployerse: employerse) => {
          this.localStorageService.setItemWithExpiry("Employerse", createdEmployerse, 86400000);

          this.router.navigate(['/']).then(() => {
            window.location.reload();
            this.notificationService.showPopup(
              'success',
              'המשתמש נוצר בהצלחה',
              'ברוכים הבאים, מקווים שתהנו'
            );
          });
        },
        error: err => {
          console.error("שגיאה בשמירת המשתמש:", err);
          alert("אירעה שגיאה ביצירת המשתמש. נסה שוב.");
        }
      });
    },
    error: err => {
      if (err.status === 404) {
        // המשתמש לא קיים - ניצור אותו
        const e = new employerse(
          "", // id ייווצר בשרת
          this.CreateUserForm.get('email')?.value,
                this.CreateUserForm.get('password')?.value,
          
          this.CreateUserForm.get('phone')?.value,
          this.CreateUserForm.get('address')?.value,
          this.CreateUserForm.get('first_name')?.value,
          this.CreateUserForm.get('last_name')?.value,
          this.CreateUserForm.get('birth_date')?.value
        );

        this.employerseService.post_employerse(e).subscribe({
          next: (createdEmployerse: employerse) => {
            this.localStorageService.setItemWithExpiry("Employerse", createdEmployerse, 86400000);

            this.router.navigate(['/']).then(() => {
              window.location.reload();
              this.notificationService.showPopup(
                'success',
                'המשתמש נוצר בהצלחה',
                'ברוכים הבאים, מקווים שתהנו'
              );
            });
          },
          error: err => {
            console.error("שגיאה בשמירת המשתמש:", err);
            alert("אירעה שגיאה ביצירת המשתמש. נסה שוב.");
          }
        });
      } else {
        console.error("שגיאה בלתי צפויה:", err);
        alert("אירעה שגיאה, נסה שוב");
      }
    }
  });
}
    
    

    
    else{
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
        const resum =  x.path; // מקבל את הנתיב מהשרת
  
  
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
            this.localStorageService.setItemWithExpiry("Employee",e || "",86400000);

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

  const email = this.loginForm.get('email')?.value;
  const password = this.loginForm.get('password')?.value;
  const isEmployer = this.loginForm.get('is_employer')?.value;

  if (isEmployer > 0) {
    try {
      const data = await this.employerseService.getemployerse(new employerse_login(email, password)).toPromise();
    

      if (data && typeof data !== 'string') {
        this.localStorageService.setItemWithExpiry("Employerse", data, 86400000);
    

        this.servjobs.get_all_jobs().subscribe({
          next: (jobs: Job[]) => {
      
            let filteredJobs = jobs.filter(job => String(job.employer) === String(data.id));
        

            this.localStorageService.setItemWithExpiry("JobsByEmployer", filteredJobs, 86400000);

            $(".message_tey")?.text("");
            this.authService.login();
            this.router.navigate(['/']).then(() => {
              window.location.reload();
            });
          },
          error: (err) => {
            console.error('שגיאה בקבלת משרות:', err);
            $(".message_tey")?.text("שגיאה בקבלת משרות");
          }
        });

      } else {
        
        this.localStorageService.setItemWithExpiry("mail", email, 86400000);
        this.step = 2;
        $(".message_tey")?.text("סיסמה שגויה, נסה שוב או לחץ על 'שכחתי סיסמה'");
      }

    } catch (error: any) {
      console.error('שגיאה בכניסה:', error);
      this.localStorageService.setItemWithExpiry("mail", email, 86400000);

      if (error.status === 401) {
        this.forgotPasswordVisible = true;
        $(".message_tey")?.text("סיסמה שגויה, נסה שוב או לחץ על 'שכחתי סיסמה'");
      } else if (error.status === 404) {
        $(".message_tey")?.text("משתמש זה אינו קיים");
      } else {
        $(".message_tey")?.text("שגיאה בלתי צפויה, נסה שוב מאוחר יותר");
      }
    }

  } else {
    // עובד רגיל
    try {
      const data = await this.employeesServ.get_employee(new employee_login(email, password)).toPromise();
   

      if (typeof data !== 'string') {
        this.localStorageService.setItemWithExpiry("Employee", data, 86400000);

        $(".message_tey")?.text("");
        this.authService.login();
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });

      } else {

        this.localStorageService.setItemWithExpiry("mail", email, 86400000);
        this.step = 2;
        $(".message_tey")?.text("סיסמה שגויה, נסה שוב או לחץ על 'שכחתי סיסמה'");
      }

    } catch (error: any) {
      console.error('שגיאה בכניסת עובד:', error);
      this.localStorageService.setItemWithExpiry("mail", email, 86400000);

      if (error.status === 401) {
        this.forgotPasswordVisible = true;
        $(".message_tey")?.text("סיסמה שגויה, נסה שוב או לחץ על 'שכחתי סיסמה'");
      } else if (error.status === 404) {
        $(".message_tey")?.text("משתמש זה אינו קיים");
      } else {
        $(".message_tey")?.text("שגיאה בלתי צפויה, נסה שוב מאוחר יותר");
      }
    }
  }
}


  generateSecureRandomPassword(): string {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return (array[0] % 900000 + 100000).toString();
  }
  
  showForgotPasswordForm() {
    // הצגת טופס איפוס סיסמה
    let pass=this.generateSecureRandomPassword()  
    let pass_encr= this.Encryption_Service.encryptData(pass);
    this.localStorageService.setItemWithExpiry("pass",pass_encr,86400000);
 
    this.employeesServ.send_password(this.localStorageService.getItemWithExpiry("mail")?.value!,pass_encr)
    .subscribe({
      next: response => {
        this.count=0;
        this.notificationService.showPopup("success","קוד האימות נשלח בהצלחה","אנא הכנס למייל ותבדוק מהו קוד האימות");
    
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
passwordVisible = false;

togglePasswordVisibility() {
  this.passwordVisible = !this.passwordVisible;
}

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
constructor(private servjobs:JobsService,private notificationService:NotificationService,private fb:FormBuilder,private Encryption_Service:EncryptionService,private employeesServ:EmployeesService,private router: Router,private uploadService:UploadService,
  private localStorageService:LocalStorageService
  ,private employerseService:EmployerseService,private authService:AuthService){
  this.resetPasswordForm = this.fb.group({
    password: ['', Validators.required],
    verification: ['', Validators.required]
  }
  ,{ validators: this.passwordMatchValidator } // ✅ וולידציה של התאמת הסיסמאות ברמת ה-FormGroup
);

this.loginForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
  is_employer: [0, Validators.required]
});
   this.CreateUserForm = this.fb.group({
    is_employer: [0, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), this.strongPasswordValidator]],
    verification: ['', [Validators.required, Validators.minLength(6)]],
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    birth_date: ['', [Validators.required, this.minAgeValidator(18)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?\d{1,3}\d{9,15}$/)]],
    resume: [''],   // בלי ולידטורים כרגע
    address: [''],  // גם בלי ולידטורים כרגע
  }, {
    validators: [this.passwordMatchValidator]
  });

  this.handleEmployerChange(); // הקשב לשינויים בשדה

this.verificationCode  = this.fb.group({
  Code: ['', [Validators.required, Validators.min(6)]],

})
}
handleEmployerChange() {
  this.CreateUserForm.get('is_employer')?.valueChanges.subscribe(val => {
    const resumeCtrl = this.CreateUserForm.get('resume');
    const addressCtrl = this.CreateUserForm.get('address');

    if (val === 0) {
      // דורש עבודה – צריך קובץ קו"ח, לא צריך כתובת
      resumeCtrl?.setValidators([Validators.required, Validators.minLength(6)]);
      addressCtrl?.clearValidators();
    } else {
      // מעסיק – צריך כתובת, לא צריך קובץ קו"ח
      addressCtrl?.setValidators([Validators.required, Validators.minLength(2)]);
      resumeCtrl?.clearValidators();
    }

    resumeCtrl?.updateValueAndValidity();
    addressCtrl?.updateValueAndValidity();
  });
}



}
