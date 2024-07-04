import { Component } from '@angular/core';
import { BoraApiService } from './bora-api.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  version: string = "";
  constructor(
    private boraApiService: BoraApiService,
    private titleService: Title) { }
  ngOnInit(): void {
    this.RequestVersion();
    let title = "bora.work | Capacitando Engenheiros e Tecnologistas para as melhores soluções do mercado.";
    if(window.location.hostname == "bora.social")
      title = "bora.social | Produtora de eventos presenciais e virtuais em Porto Alegre e região";
    this.titleService.setTitle(title);
  }

  isHome(){
    return window.location.pathname == '/';
  }

  private RequestVersion(){
      this.boraApiService.getText('version', (version: string) => {
        this.version = version;
      });
  }
}
