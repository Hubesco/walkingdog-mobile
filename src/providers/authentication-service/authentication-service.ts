import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class AuthenticationServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello AuthenticationServiceProvider Provider');
  }

  getCurrentUser(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      let currentUser = new User();
      currentUser.uuid = '123456789';
      currentUser.email = 'walkingdog@hubesco.com';
      resolve(currentUser);
    });
  }

}

export class User {

  uuid: string;
  email: string;
}
