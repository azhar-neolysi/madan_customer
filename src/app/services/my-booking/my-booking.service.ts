import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class MyBookingService {

  constructor(private api: ApiService) { }

  getMyBookings(id) {
    return this.api.get(`VehicleBookingEnqResponse/GetBookingEnqDetails/?customerid=${id}`);
  }
}
