import { Component } from '@angular/core';
import { DivagandoApiService } from '../divagando-api.service';
import { Content } from '../models/content.model';
import { Home } from '../models/home.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css','./normalize.component.css', './feature-arrow.component.css']
})
export class HomeComponent {
  home: Home = new Home;

  constructor(private divagandoApiService: DivagandoApiService){
    this.getContents();
  }
  getContents(){
    let contentsUri = `contents?filter=collection eq 'home'`;
    if(window.location.origin.includes('tunel'))
      contentsUri = `contents?filter=collection eq 'home' and accountId eq 5`;

    this.divagandoApiService.get(contentsUri, (homeContents: Content[])=>{
      var contents = Object.keys(this.home);
      for (const contentKey of contents) {
        let homeContent = homeContents.filter(e=>e.key == contentKey);
        const homeContentText = homeContent.length ? homeContent[0].text : undefined;
        Reflect.set(this.home, contentKey, homeContentText);
      }
    });
  }
}
