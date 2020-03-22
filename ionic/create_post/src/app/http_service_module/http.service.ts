import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private httpClient : HttpClient
  ) { }

  SERVER_ADDRESS: string = "http://155.230.90.22:9000";
  header = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  );

  httpSubject  =  new  BehaviorSubject(false);

  register(info) : Observable<{}> {
    let URL = `${this.SERVER_ADDRESS}/user/register`;
    return this.httpClient.post(URL, info, {headers: this.header})
    .pipe(
      tap(async (res) => {
        console.log("registerservice "+ res["register"]);
        if(res["register"] === "success"){
          this.httpSubject.next(true);
        }else{
          this.httpSubject.next(false);
        }
      })
    );
  }

  login(info) : Observable<{}> {
    let URL = `${this.SERVER_ADDRESS}/user/login`;
    return this.httpClient.post(URL, info, {headers: this.header})
    .pipe(
      tap(async (res) => {
        console.log("loginservice "+ res["login"]);
        if(res["login"] === "success"){
          this.httpSubject.next(true);
        }else{
          this.httpSubject.next(false);
        }
      })
    );
  }
  
  get_project_list(user_id) : Observable<{}> {
    let URL = `${this.SERVER_ADDRESS}/project/select?user_id=${user_id}`;
    return this.httpClient.get(URL, {headers: this.header});
  }
  create_noti(info): Promise<{}>{
    let URL = `${this.SERVER_ADDRESS}/create/noti`;
    return this.httpClient.post(URL, info, {headers: this.header}).toPromise();
  }
  create_big_task(info) : Promise<{}>{
    let URL = `${this.SERVER_ADDRESS}/task/createBIG`;
    return this.httpClient.post(URL, info).toPromise();
  }

  create_mid_task(info) : Promise<{}>{
    let URL = `${this.SERVER_ADDRESS}/task/createMID`;
    return this.httpClient.post(URL, info).toPromise();
  }

  create_sml_task(info) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/task/createSML`;
    return this.httpClient.post(URL, info).toPromise();
  }

  generate_project(info) : Observable<{}> {
    let URL = `${this.SERVER_ADDRESS}/project/create`;
    return this.httpClient.post(URL, info, {headers: this.header})
    .pipe(
      tap(async (res) => {
        console.log("PROJECT create "+ res["create"]);
        if(res["create"] === "success"){
          this.httpSubject.next(true);
        }else{
          this.httpSubject.next(false);
        }
      })
    );
    
  }

  get_proj_name(proj_id : string) : Promise<{}>{
    let URL = `${this.SERVER_ADDRESS}/projectName/select?proj_id=${proj_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  get_task_big_list(proj_id : string) : Observable<{}> {
    let URL = `${this.SERVER_ADDRESS}/taskView/Big/select?proj_id=${proj_id}`;
    return this.httpClient.get(URL, {headers: this.header});
  }

  get_task_mid_list(big_id : string) : Observable<{}> {
    let URL = `${this.SERVER_ADDRESS}/taskView/Mid/select?big_id=${big_id}`;
    return this.httpClient.get(URL, {headers: this.header});
  }

  get_task_sml_list(mid_id : string) : Observable<{}> {
    let URL = `${this.SERVER_ADDRESS}/taskView/Sml/select?mid_id=${mid_id}`;
    return this.httpClient.get(URL, {headers: this.header});
  }


  get_noti_list(proj_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/notification/select?proj_id=${proj_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  get_task_big_listp(proj_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/taskView/Big/select?proj_id=${proj_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  get_task_mid_listp(big_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/taskView/Mid/select?big_id=${big_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  get_task_sml_listp(mid_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/taskView/Sml/select?mid_id=${mid_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  update_project_state(proj_id : string, proj_status : string) : Promise<{}>{
    let URL = `${this.SERVER_ADDRESS}/update-status/project?proj_id=${proj_id}&proj_status=${proj_status}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }
  update_project_progress(proj_id : string, proj_progress : string) : Promise<{}>{
    let URL = `${this.SERVER_ADDRESS}/update-progress/project?proj_id=${proj_id}&proj_progress=${proj_progress}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  update_post_state(type: string, id : string, status : string) : Promise<{}>{
    let URL = `${this.SERVER_ADDRESS}/update-status/${type}?id=${id}&status=${status}`;     
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }
  
  insert_comment_big(big_id : string, bigco_author: string, bigcomment: string, bigco_time: string, bigco_status : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/insert/big-comment?BigID=${big_id}&BigCoAuthor=${bigco_author}&BigComment=${bigcomment}&BigTime=${bigco_time}&BigCoStatus=${bigco_status}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  insert_comment_mid(mid_id : string, midco_author: string, midcomment: string, midco_time: string, midco_status : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/insert/mid-comment?MidID=${mid_id}&MidCoAuthor=${midco_author}&MidComment=${midcomment}&MidTime=${midco_time}&MidCoStatus=${midco_status}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  insert_comment_sml(sml_id : string, smlco_author: string, smlcomment: string, smlco_time: string, smlco_status : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/insert/sml-comment?SmlID=${sml_id}&SmlCoAuthor=${smlco_author}&SmlComment=${smlcomment}&SmlTime=${smlco_time}&SmlCoStatus=${smlco_status}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  insert_comment_noti(noti_id : string, notico_author: string, noticomment: string, notico_time: string, notico_status : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/insert/noti-comment?NotiID=${noti_id}&NotiCoAuthor=${notico_author}&NotiComment=${noticomment}&NotiTime=${notico_time}&NotiCoStatus=${notico_status}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }
  
  get_comment_big_list(big_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/select/big-comment?big_id=${big_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  get_comment_mid_list(mid_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/select/mid-comment?mid_id=${mid_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  get_comment_sml_list(sml_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/select/sml-comment?sml_id=${sml_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  get_comment_noti_list(noti_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/select/noti-comment?noti_id=${noti_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  del_comment_big(bigc_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/delete/big-comment?bigc_id=${bigc_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  del_comment_mid(midc_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/delete/mid-comment?midc_id=${midc_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  del_comment_sml(smlc_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/delete/sml-comment?smlc_id=${smlc_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  del_comment_noti(notic_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/delete/noti-comment?notic_id=${notic_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  get_one_info_project(proj_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/one-project/select?proj_id=${proj_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  get_one_info_postbig(big_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/one-postbig/select?big_id=${big_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  get_one_info_postmid(mid_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/one-postmid/select?mid_id=${mid_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  get_one_info_postsml(sml_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/one-postsml/select?sml_id=${sml_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  get_one_info_postnoti(noti_id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/one-postnoti/select?noti_id=${noti_id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }

  get_search_words(id : string) : Promise<{}> {
    let URL = `${this.SERVER_ADDRESS}/select/search?proj_id=${id}`;
    return this.httpClient.get(URL, {headers: this.header}).toPromise();
  }
  
}
