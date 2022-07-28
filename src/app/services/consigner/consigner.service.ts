import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsignerService {

  constructor(private api: ApiService) { }

  getConsigners(id) {
    return this.api.get(`Consigner/GetConsignerByCustometID/?custid=${id}`);
  }

  getConsigner(consignerId, customerId) {
    return this.api.get(this.api.formUrl(`Consigner/GetConsignerByCustometID/?custid=${customerId}&ConsignerId=${consignerId}`));
  }

  saveConsigner(req) {
    return this.api.post(`Consigner`, req);
  }

  updateConsigner(req, id) {
    return this.api.put(`Consigner/${id}`, req);
  }
  getCityBySate(name) {
    return this.api.get('ReferenceList/GetRLByRLDesclike/?name=' + name);
  }
  getState(id) {
    return this.api.get(this.api.formUrl('ReferenceList', id));
  }
deleteConsigner(id){
return this.api.delete(`Consigner/${id}`);
}
}
