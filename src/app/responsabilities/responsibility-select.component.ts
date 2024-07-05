import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BoraApiService } from '../bora-api.service';
import { Responsibility } from '../models/responsibility.model';

@Component({
  selector: 'app-responsibility-select',
  templateUrl: './responsibility-select.component.html',
  styleUrls: ['./responsibility-select.component.css']
})
export class ResponsibilitySelectComponent {
  responsibilities: Responsibility[] = [];
  selectedResponsibilities: Responsibility[] = [];
  public selecting: boolean = false;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'title',
    selectAllText: 'Selecionar Todos',
    unSelectAllText: 'Deselecionar Todos',
    itemsShowLimit: 4,
    allowSearchFilter: true
  };

  constructor(private boraApiService: BoraApiService) {
    this.boraApiService.getResponsibilities((responsibilities: Responsibility[])=>{
      this.responsibilities = responsibilities;
    });
  }
}
