import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BoraApiService } from '../bora-api.service';
import { Scenario } from '../models/scenario.model';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
})
export class ScenariosComponent {
  scenarios?: Scenario[];
  constructor(private boraApiService: BoraApiService,
              private toastr: ToastrService,
              private activeRoute: ActivatedRoute) {
      this.setScenarios();
}
getUsername(){
  return this.activeRoute.snapshot.params['user'] || 'lucasfogliarini';
}
setScenarios(){
    this.boraApiService.getScenarios(this.getUsername(), (scenarios: Scenario[])=>{
      this.scenarios = scenarios;
    });
  }
toggle(scenarioId: number, enabled: boolean){
  const scenario = new Scenario;
  scenario.id = scenarioId;
  scenario.enabled = enabled;
  scenario.updatedAt = new Date;
  this.boraApiService.patch(`scenarios/${scenarioId}`, scenario, (event: Event) => {
      this.toastr.success(`Título alterado.`);
    }, async (errorResponse: HttpErrorResponse)=>{
    this.toastr.error(`Erro ao alterar o título.`);
  });
}
}
