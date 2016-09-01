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
        title: "Bienvenido!",
        description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
        image: "img/ica-slidebox-img-1.png",
      },
      {
        title: "What is Ionic?",
        description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
        image: "img/routes.png",
      },
      {
        title: "What is Ionic Cloud?",
        description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
        image: "img/ica-slidebox-img-3.png",
      }
    ];
  }

}
