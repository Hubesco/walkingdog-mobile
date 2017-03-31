import { Component,ViewChild,ElementRef } from '@angular/core';
import { AlertController,NavController,ToastController } from 'ionic-angular';
import { Http, Response, Headers } from '@angular/http';
import { LocationTracker } from '../../../components/location/location-tracker';
import { SecurityContextHolder } from '../../../components/authentication/security-context-holder';
import { Configuration } from '../../../components/configuration';


// Comes from Google Maps JavaScript API. See index.html
declare var google;

@Component({
  selector: 'map-tab',
  templateUrl: 'map-tab.html'
})
export class MapTab {

  // Stores Google map
  private map: any;
  // Html element map to display Google map
  @ViewChild('map') mapElement: ElementRef;
  // Stores the marker of the current user
  currentUserMarker: any;
  // Stores the markers of pets around
  petsAroundMarkers: Array<any>;
  walking: boolean;
  toast: any;

  constructor(
    private navCtrl: NavController, 
    private http: Http,
    private locationTracker: LocationTracker,
    private securityContextHolder: SecurityContextHolder,
    private alertCtrl: AlertController,
    private configuration: Configuration,
    private toastCtrl: ToastController) {
    this.petsAroundMarkers = [];
    this.walking = this.securityContextHolder.getCurrentUser().isWalking();
  }
  
  // http://www.joshmorony.com/ionic-2-how-to-use-google-maps-geolocation-video-tutorial/
  // https://forum.ionicframework.com/t/blank-google-maps-after-navigation/51104/13
  // http://stackoverflow.com/questions/39922627/issue-with-google-maps-javascript-api-and-ionic-2
  // https://github.com/driftyco/ionic-conference-app/blob/master/src/pages/map/map.ts

  ionViewDidLoad() {
    // Loads Google Map
    this.loadMap();
    // After we've got the position, we init process
    this.init();
  }

  // Called by locate me button to center the map on user location
  buttonLocateMe() {
    // Centers the map on the user current position.
    let currentPosition = new google.maps.LatLng(this.locationTracker.getLat(), this.locationTracker.getLng());
    this.map.setCenter(currentPosition);
  }

  buttonStartWalk() {
    this.walking = this.securityContextHolder.getCurrentUser().walk();
    this.updateMyMarker();
  }

  buttonStopWalk() {
    this.walking = this.securityContextHolder.getCurrentUser().stop();
    this.updateMyMarker();
  }

  refresh() {
    this.init();
  }

  isTracking() {
    return this.locationTracker.isTracking();
  }

  private presentLoadingMessage() {
    // Friendly message
    this.toast = this.toastCtrl.create({
      message: 'Loading current position...',
      position: 'middle'
    });
    // Shows loading message
    this.toast.present();
    // Waits for 10 seconds
    setTimeout(() => {
      if (!this.isTracking()) {
        this.toast.dismiss();
        this.presentNoGeolocationMessage();
      }
    }, 10000);
  }

  private presentNoGeolocationMessage() {
    let alert = this.alertCtrl.create({
      title: 'Unable to find you',
      subTitle: 'The app could not locate you. Please hit refresh button to try again.',
      buttons: ['OK']
    });
    alert.present();
  }

  private init() {
    // Shows a message to the user saying that app is searching location
    this.presentLoadingMessage();
    // Starts tracking of the user
    this.locationTracker.startTracking().then(() => {
      // Removes loading message
      this.toast.dismiss();
      // Centers the map on the user current position.
      let currentPosition = new google.maps.LatLng(this.locationTracker.getLat(), this.locationTracker.getLng());
      this.map.setCenter(currentPosition);
      // Updates user position
      this.updateMyMarker();
      // Find dogs around
      this.showPetsInMap();
      // Refresh map every 10 seconds
      setInterval(() => {
        // Updates user position
        this.updateMyMarker();
        // Find dogs around
        this.showPetsInMap();
      }, 10000);
    }).catch(() => {
      this.toast.dismiss();
      this.presentNoGeolocationMessage();
    });

  }

  private loadMap() {
    // Loading a map with default position.
    let latLng = new google.maps.LatLng(51.528308, -0.3817765,10);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    google.maps.event.addListenerOnce(this.map, 'idle', () => { 
      this.mapElement.nativeElement.classList.add('show-map'); 
    });
  }

  private updateMyMarker() {
    // Removes previous user location
    if (this.currentUserMarker) {
      this.currentUserMarker.setMap(null);
    }
    // Creates and stores a new marker with the current position.
    let icon = null;
    this.currentUserMarker = this.addMarker(
      this.securityContextHolder.getCurrentUser().getUuid(),
      this.securityContextHolder.getCurrentUser().getDogUuid(), 
      this.securityContextHolder.getCurrentUser().getDogName(), 
      this.locationTracker.getLat(), 
      this.locationTracker.getLng(), icon);
  }

  private showPetsInMap() {
    // Prepares the request
    let params: string = [
    `ne-lat=${this.map.getBounds().getNorthEast().lat()}`,
    `ne-lon=${this.map.getBounds().getNorthEast().lng()}`,
    `sw-lat=${this.map.getBounds().getSouthWest().lat()}`,
    `sw-lon=${this.map.getBounds().getSouthWest().lng()}`
    ].join('&');

    // Sets authorization header
    let headers = new Headers();
    headers.append('Authorization', this.securityContextHolder.getAuthorizationHeaderValue()); 

    // Sends request to backend
    this.http.request(`${this.configuration.wdLocationApiUrl()}/dogsAround?${params}`, {headers : headers})
    .subscribe((res: Response) => {
      // Removes previous markers
      for (let marker of this.petsAroundMarkers) {
        marker.setMap(null);
      }
      // Clears array
      this.petsAroundMarkers = []; 
      // Creates new markers
      for (let pet of res.json()) {
        if (pet.userUuid !== this.securityContextHolder.getCurrentUser().getUuid()) { // Filters the marker of the user
          // Adds new marker
          let marker = this.addMarker(
            pet.userUuid,
            pet.dogUuid, 
            pet.dogName, 
            pet.latitude, 
            pet.longitude, 
            'assets/icon/marker-pets.png');
          // Keeps reference of created marker
          this.petsAroundMarkers.push(marker);
        }
      }
    });
  }

  private addMarker(userUuid: string, dogUuid: string, dogName: string, lat: number, lng : number, iconUrl: string): any {
    let currentPosition = {lat: lat, lng: lng};
    //let icon = {
      //scaledSize: new google.maps.Size(32, 32), // scaled size
      //  url: iconUrl // url
      //}

      let marker = new google.maps.Marker({
        map: this.map,
        //animation: google.maps.Animation.DROP,
        position: currentPosition,
        icon: iconUrl
      });
      //<img src="${this.configuration.wdProfileApiUrl() + '/' + userUuid + '/dogs/' + dogUuid + '/image'}">
      let content = `<h4>${dogName}</h4>`;          
      this.addInfoWindow(marker, content);
      return marker;
    }

    private addInfoWindow(marker, content){
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });
    }

  }
