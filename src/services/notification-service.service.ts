import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  showPopup(type: 'success' | 'error', title: string, subtitle: string, onClose?: () => void) {
    Swal.fire({
      title: title,
      text: subtitle,
      iconHtml: type === 'success' ? '😊' : '😞', // סמיילי מתאים
      confirmButtonText: 'אישור',
      confirmButtonColor: type === 'success' ? '#28a745' : '#dc3545',
      showCloseButton: true, // ❌ כפתור לסגירת הפופאפ
      customClass: { popup: 'rtl-popup' }
    }).then((result) => {
      if (onClose) { // אם הועברה פונקציה, מבצעים אותה
        onClose();
      }
    });
  }

  showSuccess(onClose?: () => void) {
    this.showPopup('success', 'הצלחה!', 'הפעולה בוצעה בהצלחה.', onClose);
  }

  showError(onClose?: () => void) {
    this.showPopup('error', 'שגיאה!', 'אירעה שגיאה בביצוע הפעולה.', onClose);
  }
}
