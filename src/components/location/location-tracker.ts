import { Injectable } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Http, Response, Headers } from '@angular/http';
import { SecurityContextHolder,User } from '../authentication/security-context-holder';

import { Configuration } from '../configuration';

@Injectable()
export class LocationTracker {


  private lat: number = 0;
  private lng: number = 0;
  private tracking: boolean;
  private watchGeolocation: any;

  constructor(
    private securityContextHolder: SecurityContextHolder,
    private http: Http,
    private configuration: Configuration,
    private backgroundGeolocation: BackgroundGeolocation,
    private geolocation: Geolocation) {
    this.tracking = false;
    this.configureBackgroundGeolocation();
  }

  startTracking() {
    if (!this.tracking) {
      // Starts background tracking
      this.backgroundGeolocation.start();
      // Starts foreground tracking
      let promise = this.startGeolocation();
      return promise;
    } else {
      return new Promise(((resolve, reject) => {resolve()}));
    }

  }

  stopTracking() {
    // Stops background tracking
    this.backgroundGeolocation.stop();
    // Stops foreground tracking
    this.watchGeolocation.unsubscribe();
    // Sets state
    this.tracking = false;
  }

  hasPosition(): boolean {
    return this.lat != 0 && this.lng != 0;
  }

  // Deals with background tracking, when app is running but not active.
  private configureBackgroundGeolocation() {
    // Background Tracking options
    let config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      //debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: true // enable this to clear background location settings when the app terminates
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {
      this.processPosition(location);
      // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
      // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
      // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
      this.backgroundGeolocation.finish(); // FOR IOS ONLY
    }, (err) => {
      console.log(err);
      // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
      // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
      // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
      this.backgroundGeolocation.finish(); // FOR IOS ONLY
    });
  }

  // Deals with foreground tracking, when app is running and active.
  private startGeolocation() {

    let promise = new Promise((resolve, reject) => {
      // Foreground Tracking options
      let options = {
        enableHighAccuracy: true,
        timeout: 10000
      };

      this.watchGeolocation = this.geolocation
      .watchPosition(options)
      .filter((p) => p.coords !== undefined) //Filter Out Errors
      .subscribe((position) => {
        this.processPosition(<Geoposition> position);
        this.tracking = true;
        resolve();
        
      });
    });
    return promise;
  }

  private processPosition(position: Geoposition) {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
    this.registerMyLocation();
  }

  // Sends location of current user to server, to be used by others
  private registerMyLocation() {
    let currentUser: User = this.securityContextHolder.getCurrentUser();
    let headers = new Headers();
    headers.append('Authorization', this.securityContextHolder.getAuthorizationHeaderValue()); 

    this.http.post(
      `${this.configuration.wdLocationApiUrl()}/register`,
      JSON.stringify({
        userUuid: currentUser.getUuid(), 
        dogUuid: currentUser.getDogUuid(),
        dogName: currentUser.getDogName(),
        latitude: this.lat,
        longitude: this.lng,
        walking : currentUser.isWalking()
      }),
      {headers : headers})
    .subscribe((res: Response) => {
      // nothing
    });
  }

  public getLat(): number {
    return this.lat;
  }

  public getLng(): number {
    return this.lng;
  }

  public isTracking(): boolean {
    return this.tracking;
  }

}