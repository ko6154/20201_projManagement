import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  proj_id: string;

  constructor(
    private http: HttpService,
    private dataService: DataService
  ) {
    this.proj_id = dataService.getProjectID();
  }
  files = new Array();
  dfiles : any;

  ngOnInit() {
    // const searchbar = document.querySelector('ion-searchbar');
    // searchbar.addEventListener('ionInput', this.handleInput);
    
    this.http.get_search_words(this.proj_id).then(
      (res: any[]) => {

        let tmp: Array<{}> = [];
        if (res == null) return;
        res.forEach(function (val, idx, arr) {
          tmp.push({
            word: val["WORD"],
            data: val["FILE_PATHS"],
          });
        });

        for(var i=0; i<tmp.length; ++i){
          var sp_file = tmp[i]['data'].split("*");
          for(var j=0; j<sp_file.length; ++j){
            var sp_path = sp_file[j].split("/");
            var name = sp_path[sp_path.length-1];
            this.files.push({
              word: tmp[i]['word'],
              name: name,
              path: `http://155.230.90.22:9000/download?path=${sp_file[j]}`,
              status: true
            })
          }
        }
        this.dfiles = this.files;
      },
      error => {
        console.log(error);
      }
    );
  }

  filter(event){
    this.dfiles = this.files;
    var val = event.target.value;
    // console.log(val);
    if(val && val.trim() != ''){
      this.dfiles = this.dfiles.filter((file) => {
        console.log(file.word.toLowerCase().indexOf(val.toLowerCase()));
        return file.word.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    }
  }

  handleInput(event) {
    const items = Array.from(document.querySelector('ion-list').children);
    const query = event.target.value.toLowerCase();
    console.log(items);
    requestAnimationFrame(() => {
      
      for(var i=0; i<items.length; ++i){
        var item = items[i];
        // console.log(item.textContent);
        const shouldShow = item.textContent.split(" ")[0].toLowerCase().indexOf(query)>-1;//item.word.toLowerCase().indexOf(query) > -1;
        // item.status = shouldShow ? true : false;
        (item as HTMLElement).style.display = shouldShow ? 'block' : 'none';
      };
    });
  }

}
