import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DogsServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello DogsServiceProvider Provider');
  }

  getDogsAround(userUUID: string): Promise<Array<Dog>> {
    return new Promise<Array<Dog>>((resolve, reject) => {
      console.log(`Retrieve dogs around for user ${userUUID}`)
      let dogsAround = new Array<Dog>();
      let hyumiko: Dog = new Dog();
      hyumiko.uuid = "1";
      hyumiko.name = "Hyumiko";
      hyumiko.breed = "Shiba Inu"
      hyumiko.rate = 5.0;
      hyumiko.imgUrl = "assets/imgs/avatar-shiba.jpg"
      dogsAround.push(hyumiko);
      let reveur: Dog = new Dog();
      reveur.uuid = "2";
      reveur.name = "Reveur";
      reveur.breed = "Teckel"
      reveur.rate = 5.0;
      reveur.imgUrl = "assets/imgs/avatar-teckel.jpg";
      dogsAround.push(reveur);

      resolve(dogsAround);
    });
  } 

}


export class Dog {
  uuid: string;
  name: string;
  breed: string;
  rate: number;
  imgUrl: string;
}