import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private api: ApiService) { }

  getProfileData(userId) {
    return this.api.get(this.api.formUrl('User', userId));
  }
  editProfile(userData, userId) {
    return this.api.put(this.api.formUrl('User', userId), userData);
  }
}
