import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../services/language/language.service';
import { LocalstorageService } from '../services/localstorage/localstorage.service';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  languages = [];
  selected = '';
  constructor(private languageService: LanguageService, private ls: LocalstorageService) { }

  ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.selected = this.ls.getMyLanguage();
  }
  select(data) {
    console.log('before', this.selected);
    this.languageService.setLanguage(data);
    this.ngOnInit();
  }

}
