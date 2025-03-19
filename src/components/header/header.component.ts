import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service.service';
import { PopupMessageComponent } from '../popup-message/popup-message.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [AsyncPipe],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoggedIn$!: Observable<number>;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    window.location.reload();
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
      if (result) {
        this.logout();
      }
    });
  }
}
