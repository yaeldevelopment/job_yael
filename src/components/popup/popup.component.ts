import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup',
  standalone: true,  // חשוב!!
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  showPopup = false;

  ngOnInit() {
    const lastShown = localStorage.getItem('popupLastShown');
    const now = new Date().getTime();

    // בדיקה אם הפופאפ הוצג ב-24 השעות האחרונות
    if (!lastShown || now - parseInt(lastShown) > 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        this.showPopup = true;
        localStorage.setItem('popupLastShown', now.toString());
      }, 10000); // 10 שניות
    }
  }

  closePopup() {
    this.showPopup = false;
  }
}
