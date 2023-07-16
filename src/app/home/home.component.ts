import { Component } from '@angular/core';
import { BoraApiService } from '../bora-api.service';
import { Home } from '../models/contents/home.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  home: Home = new Home;

  constructor(private boraApiService: BoraApiService){
    this.boraApiService.getContentsByDomain('home', homeContents=>{
      var contents = Object.keys(this.home);
        for (const contentKey of contents) {
          let homeContent = homeContents.filter(e=>e.key == contentKey);
          const homeContentText = homeContent.length ? homeContent[0].text : undefined;
          Reflect.set(this.home, contentKey, homeContentText);
        }
    });
  }
}