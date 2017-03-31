import { Injectable } from '@angular/core';

@Injectable()
export class SecurityContextHolder {

  private currentUser: User;

  constructor() {
    if (localStorage.getItem('currentUser') != null) {
      this.setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
    }
  }

  public getCurrentUser(): User {
    return this.currentUser;
  }

  public getAuthorizationHeaderValue(): string {
    return 'Bearer ' + this.getCurrentUser().getJwtToken();
  }


  public setCurrentUser(json: any) {
    this.currentUser = new User(
      json.uuid,
      json.email,
      json.dogUuid,
      json.dogName,
      json.dogBase64Image,
      json.dogGender,
      json.dogBreed,
      json.dogBirthdate,
      false,
      json.token
      );
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  public isAuthenticated(): boolean {
    return this.currentUser && this.currentUser.isAuthenticated();
  }

}

export class User {

  constructor(
    private uuid: string,
    private email: string,
    private dogUuid: string,
    private dogName: string,
    private dogBase64Image: string,
    private dogGender: string,
    private dogBreed: string,
    private dogBirthDate: string,
    private walking: boolean,
    private jwtToken: string) {

  }

  public isAuthenticated(): boolean {
    return (this.uuid !== 'undefined');
  }

  public isWalking(): boolean {
    return this.walking;
  }

  public getUuid(): string {
    return this.uuid;
  }

  public getDogUuid(): string {
    return this.uuid;
  }

  public getDogName(): string {
    return this.dogName;
  }

  public getDogBase64Image(): string {
    return this.dogBase64Image;
  }

  public getDogGender(): string {
    return this.dogGender;
  }

  public getDogGenderLabel(): string {
    return this.capitalizeFirstLetter(this.getDogGender().toLowerCase());
  }

  public getDogBreed(): string {
    return this.dogBreed;
  }

  public getDogBreedLabel(): string {
    return this.capitalizeFirstLetter(this.getDogBreed().toLowerCase().replace('_',' '));
  }

  public getDogBirthDate(): string {
    return this.dogBirthDate;
  }

  public getJwtToken(): string {
    return this.jwtToken;
  }

  public walk(): boolean {
    this.walking = true;
    return this.isWalking();
  }

  public stop(): boolean {
    this.walking = false;
    return this.isWalking();
  }

  private capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}