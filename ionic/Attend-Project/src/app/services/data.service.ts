import { Injectable } from '@angular/core';
import { VirtualTimeScheduler } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private data = [];
  private attend_code;
  private proj_id;

  constructor() { }

  // setData(id, data){
  //   this.data[id] = data;
  // }

  // getData(id){
  //   return this.data[id];
  // }

  getAttendCode(code){
    return this.attend_code;
  }

  setID(project_id){
    this.proj_id = project_id;
  }
  getID(){
    return this.proj_id;
  }

}
