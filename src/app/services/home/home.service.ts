import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
// import { ApiService } from 'src/app/service/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private apiService: ApiService) { }

  getRates() {
    return this.apiService.get('rate/GetRateByName/?name=CustomerRate');
  }
}
