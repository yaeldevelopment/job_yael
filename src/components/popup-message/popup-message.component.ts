import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-popup-message',
  standalone: true,
  imports: [],
  templateUrl: './popup-message.component.html',
  styleUrl: './popup-message.component.scss'
})
export class PopupMessageComponent {
  constructor(
    public dialogRef: MatDialogRef<PopupMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // המשתמש אישר
  }

  onCancel(): void {
    this.dialogRef.close(false); // המשתמש ביטל
  }
}
