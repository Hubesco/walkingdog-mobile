import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login'
import { SignupPage } from '../signup/signup'
import { HomePage } from '../home/home';
import { SecurityContextHolder } from '../../components/authentication/security-context-holder';



/*
  Generated class for the Start page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  @Component({
    selector: 'page-start',
    templateUrl: 'start.html'
  })
  export class StartPage {

    constructor(
      private securityContextHolder: SecurityContextHolder,
      private navCtrl: NavController) {
      if (this.securityContextHolder.isAuthenticated()) {
        this.navCtrl.setRoot(HomePage);
      }
    }

    ionViewDidLoad() {
    }

    buttonLogin() {
      this.navCtrl.push(LoginPage);
    }

    buttonSignup() {
      this.navCtrl.push(SignupPage);
    }
  }
