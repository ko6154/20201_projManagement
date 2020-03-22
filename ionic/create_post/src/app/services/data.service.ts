import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private project_id : string;
  private manager_id : string;
  private project_name : string;
  private attend_link : string;
  constructor() { }

  setAttendLink(link){
    this.attend_link = link;
  }
  getLink(){
    return this.attend_link;
  }

  setProjectID(project_id){
    this.project_id = project_id;
  }
  getProjectID(){
    return this.project_id;
  }

  setManagerID(manager_id){
    this.manager_id = manager_id;
  }
  getManagerID(){
    return this.manager_id;
  }

  setProjectName(project_name){
    this.project_name = project_name;
  }
  getProjectName(){
    return this.project_name;
  }
  private type   : string;
  private board_id: string;
  private title  : string;
  private start  : string;
  private end    : string;
  private author : string;
  private created: string;
  private desc   : string;
  private attaches : any[];
  
  setType(type: string){
    this.type = type;
  }
  getType(): string{
    return this.type;
  }

  setTitle(title: string){
    this.title = title;
  }
  getTitle(): string{
    return this.title;
  }

  setStart(start: string){
    this.start = start;
  }
  getStart(): string{
    return this.start;
  }

  setEnd(end: string){
    this.end = end;
  }
  getEnd(): string{
    return this.end;
  }

  setAuthor(author: string){
    this.author = author;
  }
  getAuthor(): string{
    return this.author;
  }

  setCreated(created: string){
    this.created = created;
  }
  getCreated(): string{
    return this.created;
  }

  setDesc(desc: string){
    this.desc = desc;
  }
  getDesc(): string{
    return this.desc
  }

  setAttaches(attaches: any[]){
    this.attaches = attaches;
  }
  getAttaches(): any[]{
    return this.attaches;
  }

  setBoardID(id : string){
    this.board_id = id;
  } 
  getBoardID(): string{
    return this.board_id;
  }
}
