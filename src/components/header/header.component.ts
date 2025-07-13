import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service.service';
import { PopupMessageComponent } from '../popup-message/popup-message.component';

import { LocalStorageService } from '../../services/local-storage.service';


@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ RouterOutlet,RouterLink]
})
export class HeaderComponent {
  is_login: number=0;

  constructor(
    private dialog: MatDialog,
    private router: Router,
 private localStorageService:LocalStorageService
  ) {
   if(this.localStorageService.getItemWithExpiry("Employee"))
   {
    this.is_login=1;
   }
   else if(this.localStorageService.getItemWithExpiry("Employerse"))
   {
      this.is_login=2;
   }
  }

  async logout() {
    try {
      await  localStorage.clear();
           window.location.reload();
    } catch {
      // לא מדפיס שגיאה - אבטחה
    }
  }

  openDetails() {
    this.router.navigate(['/פרטים-אישים']);
  }

  openConfirmationDialog() {
    const dialogRef = this.dialog.open(PopupMessageComponent, {
      width: '300px',
      data: { message: 'האם אתה בטוח שברצונך להתנתק?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.logout();
      }
    });
  }
}
