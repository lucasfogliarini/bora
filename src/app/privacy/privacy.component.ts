import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-privacy',
  templateUrl: 'privacy.component.html',
  styleUrls: [ 'privacy.component.css' ]
})
export class PrivacyComponent {
  env = environment;
}
