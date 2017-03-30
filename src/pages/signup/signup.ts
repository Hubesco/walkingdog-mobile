import { Component } from '@angular/core';
import { NavController,LoadingController,AlertController,Platform } from 'ionic-angular';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { StartPage } from '../start/start';
import { Http, Response } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { Configuration } from '../../components/configuration';

declare var cordova: any;

@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html'
})
export class SignupPage {

	signupForm: FormGroup;

	constructor( 
		private loadingCtrl: LoadingController,
		private navCtrl: NavController,
		private http: Http,
		private configuration: Configuration,
		private alertCtrl: AlertController,
		private camera: Camera,
		private platform: Platform,
		fb: FormBuilder) {

		this.signupForm = fb.group({
			'email': ['', Validators.required],
			'password': ['', Validators.required],
			'password_confirm': ['', Validators.required],
			'dogBase64Image': [''],
			'dogName': ['', Validators.required],
			'dogGender': ['', Validators.required],
			'dogBreed': ['', Validators.required],
			'dogBirthdate': ['', Validators.required]
		}, {validator: this.matchingPasswords('password', 'password_confirm')});
	}

	ionViewDidLoad() {
	}

	signup(form: any) {
		let loader = this.loadingCtrl.create({
			content: "Uploading data..."
		});
		loader.present();
		if (form.valid) {
			let value = form.value;
			this.http
			.post(`${this.configuration.wdAuthenticationApiUrl()}/signup`, JSON.stringify(value))
			.subscribe((res: Response) => {
				if (res.status == 201) {
					loader.dismiss();
					let alert = this.alertCtrl.create({
						title: 'You are subscribed !',
						subTitle: 'An e-mail has been sent to activate your account. Check your spam box if it does not appear in your Inbox',
						buttons: ['OK']
					});
					alert.present();
					this.navCtrl.setRoot(StartPage);
				} 

			},
			(err:Response) => {
				if (err.status == 400) {
					loader.dismiss();
					let alert = this.alertCtrl.create({
						title: 'Email already exists',
						subTitle: 'An account with the same email already exists. Please use another email.',
						buttons: ['OK']
					});
					alert.present();
					return false;
				} else {
					loader.dismiss();
					let alert = this.alertCtrl.create({
						title: 'Error',
						subTitle: 'Sorry, an error occured. Please try again later.',
						buttons: ['OK']
					});
					alert.present();
					return false;
				}
			});
		} else {
			loader.dismiss();
			//alert('Required fields : email, password, dog name, dog gender, dog breed, dog birthdate');
			return false;
		}

	}

	matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
		return (group: FormGroup): {[key: string]: any} => {
			let password = group.controls[passwordKey];
			let confirmPassword = group.controls[confirmPasswordKey];

			if (password.value !== confirmPassword.value) {
				return {
					mismatchedPasswords: true
				};
			}
		}
	}

	takePicture() {
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			targetHeight: 1000,
			targetWidth: 1000
		}
		this.camera.getPicture(options).then((imageData) => {
			// imageData is either a base64 encoded string or a file URI
			// If it's base64:
			let base64Image = 'data:image/jpeg;base64,' + imageData;
			this.signupForm.controls['dogBase64Image'].setValue(base64Image);
			let cameraImageSelector = document.getElementById('dogImage');
      cameraImageSelector.setAttribute('src', base64Image);
		}, (err) => {
			// Handle error
			console.log(err);
		});
	}

}
