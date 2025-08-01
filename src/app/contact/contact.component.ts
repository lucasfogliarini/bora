import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactMessage = `Clique em <b>WhatsApp</b>, para: <br/>
  - Conhecer e conversar com o fundador do <b>Bora encontros</b>. <br/>
  - <b>Sugerir uma melhoria</b> <br/>
  - Relatar um <b>bug ou problema</b>`;
  open(){
    window.open(`https://api.whatsapp.com/send?phone=${environment.adminPhone}&text=Oi, quero conhecer ${environment.appDefiniteArticle} ${environment.appName}, ser ${environment.mainRole} ou relatar um problema ... `);
  }
}
