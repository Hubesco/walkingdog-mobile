import { Component } from '@angular/core';

import { Http, Response, Headers } from '@angular/http';
import { NavController } from 'ionic-angular';
import { SecurityContextHolder, User } from '../../components/authentication/security-context-holder'
import { DomSanitizer } from '@angular/platform-browser';
import { Configuration } from '../../components/configuration'


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  currentUser: User;
  dogImage: string;

  constructor(
    public navCtrl: NavController,
    private securityContextHolder: SecurityContextHolder,
    public domSanitizer : DomSanitizer,
    public configuration: Configuration,
    private http: Http) {
    this.currentUser = this.securityContextHolder.getCurrentUser();
    // Sets authorization header
    let headers = new Headers();
    headers.append('Authorization', this.securityContextHolder.getAuthorizationHeaderValue()); 

    this.http.get(`${this.configuration.wdProfileApiUrl()}/${this.currentUser.getUuid()}/dogs/${this.currentUser.getDogUuid()}/image`, {headers : headers})
    .subscribe((res: Response) => {
      this.dogImage = res.json().dogBase64Image;
    });
  }

  public getAge(dateString): Number {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

}
