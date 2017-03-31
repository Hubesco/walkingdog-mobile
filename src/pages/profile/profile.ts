import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { SecurityContextHolder, User } from '../../components/authentication/security-context-holder'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  currentUser: User;

  constructor(
    public navCtrl: NavController,
    private securityContextHolder: SecurityContextHolder,
    public domSanitizer : DomSanitizer) {
    this.currentUser = this.securityContextHolder.getCurrentUser();
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
