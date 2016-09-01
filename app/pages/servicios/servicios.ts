import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';

import { ServicioDetallePage } from '../servicio-detalle/servicio-detalle';
import { MapaPage } from '../mapa/mapa';

import { Servicios } from '../../providers/servicios/servicios';

@Component({
  templateUrl: 'build/pages/servicios/servicios.html',
  providers: [
    [Servicios]
  ]
})
export class ServiciosPage {

  listServicios: any;
  listServicios_aux: any;

  loading: any;

  constructor(
    private navCtrl: NavController,
    private servicios: Servicios,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController) {
    this.presentLoading('Cargando contactos...');
  }

  onPageDidEnter() {
    this.loadData();
  }

  loadData() {
    this.servicios.load().then((data) => {
      console.log('Data: ', data);
      this.listServicios = data;
      this.listServicios_aux = data;

      this.loading.dismiss();
    }).catch(err => {
      this.loading.dismiss();
    });
  }

  initializeItems() {
    this.listServicios = this.listServicios_aux; // Esto es para evitar que los datos originales se eliminen en la busqueda del metodo 'getItems'
  }

  getItems(searchbar) {
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (q.trim() === '') {
      return;
    }

    this.listServicios = this.listServicios.filter((v) => {
      if (v.Nombre) {
        if (v.Nombre.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
      } else if (v.DescripcionCom) {
        if (v.DescripcionCom.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
      } else if (v.Telefono) {
        if (v.Telefono.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
      } else if (v.Correo) {
        if (v.Correo.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
      }

      return false;
    });
  }

  presentToast(msg, time: number) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: time,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });

    toast.present();
  }

  presentLoading(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });

    this.loading.present();
  }

  pushPage(page, params) {
    this.navCtrl.push(page, params);
  }

  openDetalleServicio(servicio_params) {
    this.pushPage(ServicioDetallePage, { selected: servicio_params });
  }

  // Abrir mapa con un solo item
  openMap(servicio_params) {
    this.pushPage(MapaPage, { selected: servicio_params });
  }
}
