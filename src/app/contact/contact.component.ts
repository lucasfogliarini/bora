import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  open(){
    window.open('https://api.whatsapp.com/send?phone=5551992364249&text=Oi, quero conhecer o Túnel Criativo, ser Parceiro ou relatar um problema ... ');
  }
}
