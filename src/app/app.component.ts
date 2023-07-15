import { Component } from '@angular/core';
import { BoraApiService } from './bora-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  version: string = "";
  constructor(
    private boraApiService: BoraApiService) { }
  ngOnInit(): void {
    this.RequestVersion();
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
