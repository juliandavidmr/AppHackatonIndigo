import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';

/*
  Generated class for the ServicioDetallePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/servicio-detalle/servicio-detalle.html',
})
export class ServicioDetallePage {

  title: string = 'Servicio detalle';

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams) {

  }

  onPageDidEnter() {
    let servicio = this.navParams.data.selected;

    if (servicio) {


      console.log('Categoria seleccionada: ', servicio);
    }
  }

}
