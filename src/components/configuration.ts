import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {

  constructor() {
  }

  public wdLocationApiUrl() : string {
    return 'https://walkingdog-services-int.herokuapp.com/api/location';
  }

  public wdAuthenticationApiUrl() : string {
    return 'https://walkingdog-services-int.herokuapp.com/api/authentication';
  }

  public wdProfileApiUrl() : string {
    return 'https://walkingdog-services-int.herokuapp.com/api/profile';
  }

}