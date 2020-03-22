import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public readonly serviceTypes = [
    'Swedish',
    'Deep Tissue',
    'Prenatal',
    'Sports',
  ];
  public readonly durations = [60, 90, 120];
  public serviceTypeIsOpen: { [key: string]: boolean } = {
    Swedish: false,
    'Deep Tissue': false,
    Prenatal: false,
    Sports: false,
  };

  constructor(){

  }

  listClick(service){
    if(this.serviceTypeIsOpen[service])
      this.serviceTypeIsOpen[service] = false;
    else
      this.serviceTypeIsOpen[service] = true;
  }
}
