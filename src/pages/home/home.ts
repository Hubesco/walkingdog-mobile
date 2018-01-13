import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { DogsServiceProvider, Dog } from '../../providers/dogs-service/dogs-service';
import { AuthenticationServiceProvider } from '../../providers/authentication-service/authentication-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  dogsAround: Array<Dog>;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private dogsService: DogsServiceProvider,
    private authService: AuthenticationServiceProvider) {
    this.dogsAround = new Array<Dog>();
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.authService.getCurrentUser()
    .then(user => {
      return this.dogsService.getDogsAround(user.uuid);
    })
    .then(data => {
      this.dogsAround = data;
      loader.dismiss();
    })
    .catch(err => {
      console.log(err);
      loader.dismiss();
      alert('Sorry, we couldn\'t load the data. Please retry later.');
    })    
  }

  viewDog(uuid) {
    console.log(uuid);
    alert('Coming soon!');
  }

}

