import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactMessage = `Clique em <b>WhatsApp</b>, para: <br/>  
- Marcar uma Consulta de TI com o arquiteto do <a href='/bora.work'>bora.work</a> <br/>
- Ser uma(o) <b>${environment.mainRole}</b> <br/>
- <b>Sugerir uma melhoria</b> <br/>
- Relatar um <b>bug ou problema</b>`;
  open(){
    window.open(`https://api.whatsapp.com/send?phone=${environment.adminPhone}&text=Oi, quero conhecer ${environment.appDefiniteArticle} ${environment.appName}, ser ${environment.mainRole} ou relatar um problema ... `);
  }
}
