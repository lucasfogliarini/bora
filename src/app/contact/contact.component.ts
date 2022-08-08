import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  env = environment;
  open(){
    window.open(`https://api.whatsapp.com/send?phone=5551992364249&text=Oi, quero conhecer ${environment.appDefiniteArticle} ${environment.appName}, ser ${environment.mainRole} ou relatar um problema ... `);
  }
}
