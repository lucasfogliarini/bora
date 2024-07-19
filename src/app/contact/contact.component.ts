import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactMessage = `Clique em <b>WhatsApp</b>, para: <br/>  
  - Formar <b>Parceria</b> <br/>
- Conversar com o fundador e arquiteto do <a href='/bora.work'>bora.work</a> e <a target='_blank' href='https://bora.earth'>bora.earth</a> <br/>
- <b>Sugerir uma melhoria</b> <br/>
- Relatar um <b>bug ou problema</b>`;
  open(){
    window.open(`https://api.whatsapp.com/send?phone=${environment.adminPhone}&text=Oi, quero conhecer ${environment.appDefiniteArticle} ${environment.appName}, ser ${environment.mainRole} ou relatar um problema ... `);
  }
}
