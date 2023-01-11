import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreDataService {

  private searchDatas = new BehaviorSubject<any>([]);
  private searchDatas2 = new BehaviorSubject<any>([]);
  data = this.searchDatas.asObservable();
  data2 = this.searchDatas2.asObservable();


  constructor() { }

  changeData(data) {
    this.searchDatas.next(data);
  }

  changeData2(data) {
    this.searchDatas2.next(data);
  }


}
