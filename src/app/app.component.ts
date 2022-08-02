import { Component } from '@angular/core';
import { DivagandoApiService } from './divagando-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  version: string = "";
  constructor(
    private divagandoApiService: DivagandoApiService) { }
  ngOnInit(): void {
    this.RequestVersion();
  }

  isHome(){
    return window.location.pathname == '/';
  }

  private RequestVersion(){
      this.divagandoApiService.getText('version', (version: string) => {
        this.version = version;
      });
  }
}
