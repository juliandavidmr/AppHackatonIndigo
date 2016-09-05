import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the AcercadePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/acercade/acercade.html',
})
export class AcercadePage {

  slides: any = [];

  constructor(private navCtrl: NavController) {
    this.slides = [
      {
        title: "Bienvenido a TravelsCO!",
        description: "<b>TravelsCO</b> te ayuda a crear recorridos con los mas atractivos sitios turisticos de Colombia. <br /> <a href='https://www.travels.co'>www.travels.co</a>",
        image: "img/routes.png",
      }
    ];
  }

}
