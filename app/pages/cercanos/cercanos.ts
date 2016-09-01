import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { ServicioDetallePage } from '../servicio-detalle/servicio-detalle';
import { MapaPage } from '../mapa/mapa';

import { Servicios } from '../../providers/servicios/servicios';

@Component({
  templateUrl: 'build/pages/cercanos/cercanos.html',
  providers: [
    [Servicios]
  ]
})
export class CercanosPage {

  listCercanos: any;
  listCercanos_aux: any;

  loading: any;

  miPosicion: any;
  radio: number;

  constructor(
    private navCtrl: NavController,
    private servicios: Servicios,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController) {
    this.presentLoading('Cargando sitios...');
  }

  onPageDidEnter() {
    Geolocation.getCurrentPosition().then(pos => {
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
      this.miPosicion = pos.coords;

      this.loadData();
    }).catch(err => {
      this.loading.dismiss();

      this.presentToast('No se ha podido obtener tu posicion. Verfica que tengas el GPS activado.', 3000);
    });
  }

  loadData() {
    this.servicios.load().then((data) => {
      console.log('Data: ', data);
      this.listCercanos = data;
      this.listCercanos_aux = data;

      this.loading.dismiss();
    }).catch(err => {
      this.loading.dismiss();
    });
  }

  initializeItems() {
    this.listCercanos = this.listCercanos_aux; // Esto es para evitar que los datos originales se eliminen en la busqueda del metodo 'getItems'
  }

  typing() {
    console.log('Radio: ', this.radio);

    this.initializeItems();

    if (this.radio) {
      this.listCercanos = this.listCercanos.filter((v) => {
        if (v.Latitud) {
          let distanceUser = 0;
          distanceUser = this.calcDistancia({
            latitud: parseFloat(v.Latitud),
            longitud: parseFloat(v.Longitud)
          });

          console.log('Distancia calculada: ', distanceUser);
          return (distanceUser <= this.radio);
        }
        return false;
      });
    }
  }

  calcDistancia(punto = { latitud: 0, longitud: 0 }) {
    let distance = this.getDistanceFromLatLonInKm(punto.latitud, punto.longitud, this.miPosicion.latitude, this.miPosicion.longitude);

    return distance;
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6378.137;
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lon2 - lon1) * (Math.PI / 180);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  getItems(searchbar) {
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (q.trim() === '') {
      return;
    }

    this.listCercanos = this.listCercanos.filter((v) => {
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
