import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  heading!: string;
  confirmationMessage!: string;
  option1!: string;
  option2!: string;
  constructor(private dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.heading = data.heading;
    this.confirmationMessage = data.confirmationMessage;
    this.option1 = data.option1;
    this.option2 = data.option2;
  }

  closeConfirmationDialog(action: string) {
    this.dialogRef.close(action);
  }
}
