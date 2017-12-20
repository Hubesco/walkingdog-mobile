import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  dogsAround: Array<Dog>;

  constructor(public navCtrl: NavController) {
    this.loadDogs();
  }

  private loadDogs() {
    this.dogsAround = new Array<Dog>();
    let hyumiko: Dog = new Dog();
    hyumiko.uuid = "1";
    hyumiko.name = "Hyumiko";
    hyumiko.breed = "Shiba Inu"
    hyumiko.rate = 5.0;
    hyumiko.imgUrl = "assets/imgs/avatar-shiba.jpg"
    this.dogsAround.push(hyumiko);
    let reveur: Dog = new Dog();
    reveur.uuid = "2";
    reveur.name = "Reveur";
    reveur.breed = "Teckel"
    reveur.rate = 5.0;
    reveur.imgUrl = "assets/imgs/avatar-teckel.jpg";
    this.dogsAround.push(reveur);
  }

  viewDog(uuid) {
    console.log(uuid);
    alert('Coming soon!');
  }

}

class Dog {
  uuid: string;
  name: string;
  breed: string;
  rate: number;
  imgUrl: string;
}
