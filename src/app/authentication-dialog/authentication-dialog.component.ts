import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-authentication-dialog',
  templateUrl: './authentication-dialog.component.html',
  styleUrls: ['./authentication-dialog.component.css']
})
export class AuthenticationDialogComponent {
  loginSupport(){
    const whatsappText = 'Não consigo logar ...';
    var whatsAppLink = `https://api.whatsapp.com/send?phone=${environment.adminPhone}&text=${whatsappText}`;
    window.open(whatsAppLink);
  }
}
