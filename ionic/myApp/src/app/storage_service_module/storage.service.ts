import { Injectable } from '@angular/core';
import { Storage } from  '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {  }

  set_uid(email : string){
    this.storage.set("USER_ID", email);
  }
  del_uid(){
    this.storage.remove("USER_ID");
  }
  get_uid() {
    return this.storage.get("USER_ID");
  }
  set_pw(pw : string){
    this.storage.set("USER_PW", pw);
  }
  del_pw(){
    this.storage.remove("USER_PW");
  }
  get_pw() {
    return this.storage.get("USER_PW");
  }
  set_name(name : string){
    this.storage.set("USER_NAME", name);
  }
  del_name(){
    this.storage.remove("USER_NAME");
  }
  get_name() {
    return this.storage.get("USER_NAME");
  }
}
