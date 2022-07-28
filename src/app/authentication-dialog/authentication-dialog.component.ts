import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-authentication-dialog',
  templateUrl: './authentication-dialog.component.html',
  styleUrls: ['./authentication-dialog.component.css']
})
export class AuthenticationDialogComponent {
  constructor(public dialogRef: MatDialogRef<AuthenticationDialogComponent>) {}
  loginSupport(){
    const whatsappText = 'Não consigo logar ...';
    const contact = '5551992364249';
    var whatsAppLink = `https://api.whatsapp.com/send?phone=${contact}&text=${whatsappText}`;
    window.open(whatsAppLink);
  }
}
