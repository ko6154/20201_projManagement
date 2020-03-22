import { Injectable } from '@angular/core';
import { DataService } from './../services/data.service'
import { Resolve, ActivatedRouteSnapshot} from '@angular/router'


@Injectable({
  providedIn: 'root'
})
export class DataResolverService implements Resolve<any>{

  constructor(private dataService: DataService) { }
  
  resolve(route: ActivatedRouteSnapshot){
    let code = route.paramMap.get('code');
    return code;
  }

}
