
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Storage, LocalStorage } from 'ionic-angular';
import { ConnectivityService } from '../../providers/connectivity-service/connectivity-service';
import { Geolocation } from 'ionic-native';

declare var google;

@Component({
  templateUrl: 'build/pages/mapa/mapa.html',
})
export class MapaPage {
  @ViewChild('map') mapElement: ElementRef;

  segment: string = 'rutas';

  map: any;
  directionsService: any;
  directionsDisplay: any;
  listRutas: any = [];
  listCiudades: any = [
    'Acevedo',
    'Aguazul',
    'Albania',
    'Altamira',
    'Arauca',
    'Armenia',
    'Balboa',
    'Barranquilla',
    'Bogotá',
    'Bosa',
    'Cali',
    'Candelaria',
    'Cartagena',
    'Cucúta',
    'Curillo',
    'Florencia',
    'Fontibon',
    'Galapa',
    'Guaviare',
    'Leticia',
    'Manizales',
    'Medellin',
    'Mocoa',
    'Montería',
    'Neiva',
    'Orito',
    'Pasto',
    'Pereira',
    'Popayan',
    'Quibdo',
    'Quibdó',
    'Rioacha',
    'Sincelejo',
    'Soacha',
    'Tunja',
    'Valledupar',
    'Villavicencio',
    'Yopal'
  ];

  visitar: any; // Listado de las ciudades y lugares dsiponibles para visitar
  desde: any; // Nombre de la cuidad a visitar
  hasta: any; // Hasta donde se quiere ir

  mapInitialised: boolean = false;
  apiKey: any;
  loader: any; // Componente de carga
  unidad: any; // Informacion de un recurso fisico seleccionado
  sede: any; // Informacion de una sede seleccionada
  title: string = 'Mapa';

  localStorage: any = new Storage(LocalStorage);

  private markerUser: any;

  constructor(
    private nav: NavController,
    private connectivityService: ConnectivityService,
    private alertCtrl: AlertController,
    private _navParams: NavParams,
    private loadingCtrl: LoadingController) {
  }

  ionViewLoaded() {
    console.log('In view loaded_');
    this.loadAll();
  }

  loadAll() {
    this.unidad = this._navParams.data.unidad;
    this.sede = this._navParams.data.sede;

    this.showLoading('Cargando mapa...');

    if (this.connectivityService.isOffline()) {
      this.loader.dismiss();
      this.presentAlert('Sin conexión', 'Ups! Parece que no tienes conexión a internet.');
    }

    this.loadGoogleMaps();
  }

  loadGoogleMaps() {
    this.addConnectivityListeners();

    if (typeof google === "undefined" || typeof google.maps === "undefined") {

      console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();

      if (this.connectivityService.isOnline()) {
        console.log("online, loading map");

        // Load the SDK
        window['mapInit'] = () => {
          this.initMap();
          this.enableMap();
        };

        let script = document.createElement("script");
        script.id = "googleMaps";

        if (this.apiKey) {
          script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
        } else {
          script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
        }

        document.body.appendChild(script);
        this.loader.dismiss();
      }
    } else {
      if (this.connectivityService.isOnline()) {
        console.log("showing map");
        this.initMap();
        this.enableMap();
      } else {
        console.log("disabling map");
        this.disableMap();
        this.loader.dismiss();
      }
    }
  }

  ngOnDestroy() {
    this.directionsDisplay.setMap(null); // clear direction from the map
    this.directionsDisplay.setPanel(null);
  }

  initMap() {
    let position_udla = {
      coords: {
        latitude: 1.619601,
        longitude: -75.604045
      }
    };

    this.mapInitialised = true;

    Geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {};
      if (this.sede) {
        latLng = new google.maps.LatLng(this.sede.posicion.x, this.sede.posicion.y);
        mapOptions = {
          center: latLng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      } else {
        mapOptions = {
          center: latLng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.markerUser = this.addMarker('Mi posicion', position.coords.latitude, position.coords.longitude, 'user');
      console.log('Marker User: ', this.markerUser);

    }).catch(err => {
      console.log('No se pudo obtener posicion.');

      let latLng = new google.maps.LatLng(position_udla.coords.latitude, position_udla.coords.longitude);

      let mapOptions = {};
      if (this.sede) {
        latLng = new google.maps.LatLng(this.sede.posicion.x, this.sede.posicion.y);
        mapOptions = {
          center: latLng,
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      } else {
        mapOptions = {
          center: latLng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }).then(_ => {
      this.addMarker('Universidad de la Amazonia', position_udla.coords.latitude, position_udla.coords.longitude, 'udla');

      if (this.unidad) {
        console.log('Add marker unidad.');
        this.addMarker(this.unidad.nombrerecurso, this.unidad.posicion.x, this.unidad.posicion.y, 'pin');
        this.title = this.unidad.nombrerecurso;
      } else if (this.sede) {
        console.log('Add marker sede.');
        this.addMarker(this.sede.nombresede, this.sede.posicion.x, this.sede.posicion.y, 'pin');
        this.title = this.sede.nombresede;
      } else { // Cargar todos los puntos del mapa si no se ha seleccionado unidad y sede
        /*
        this.localStorage.get('recursos').then((recusos_list) => {
          let aux = JSON.parse(recusos_list);
          aux.map(item => {
            this.addMarker(item.nombrerecurso, item.posicion.x, item.posicion.y, 'pin');
          });
        });
        */
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(this.map);

        // console.log('=======>', this.directionsService);
      }
    });
  }

  calcularRuta() {
    console.log('Calculando ruta...');

    this.showLoading('Calculando ruta, por favor espere...');

    console.log('Visitar: ', this.visitar);
    if (this.desde && this.hasta) {
      this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay);
    } else {
      this.loader.dismiss();
      this.presentAlert('Campos requeridos!', 'Los campos desde y hasta, son requeridos.');
    }
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = [];

    this.visitar.map(item => {
      waypts.push({
        location: item + ', Colombia',
        stopover: true
      });
    });

    directionsService.route({
      origin: this.desde + ', Colombia',
      destination: this.hasta + ', Colombia',
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
      console.log('Resultado de rutas: ', response, status);

      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];

        this.listRutas = route.legs;
        console.log('Rutas: ', this.listRutas);
      } else {
        switch (status) {
          case 'ZERO_RESULTS':
            this.presentAlert('Sin rutas!', 'En estos momentos no hay rutas para los sitios seleccionados.');
            break;
          case 'NOT_FOUND':
            this.presentAlert('Sitio no encontrado!', 'No se ha podido trazar una ruta a uno de los sitios. Puede intentar seleccionar otros distintos.');
            break;
          case 'MAX_WAYPOINTS_EXCEEDED':
            this.presentAlert('Muchos sitios seleccionados!', 'La cantidad de sitios a visitar ha excedido el límite. Intente seleccionando menos de 8 sitios.');
            break;
          case 'UNKNOWN_ERROR':
            this.loader.dismiss();
            this.presentAlert('Sin rutas!', 'En estos momentos no hay rutas para los sitios seleccionados.');
            break;
          default:
            break;
        }
        // alert('Directions request failed due to ' + status);
      }

      this.loader.dismiss();
    });
  }

  addMarker(title: string = 'Marker', lat: number, lng: number, icon: string = 'pin') {
    var marker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: this.map,
      animation: google.maps.Animation.DROP,
      title: title,
      icon: this.getUrlIcon(icon)
    });

    var infowindow = new google.maps.InfoWindow({
      content: title,
      maxWidth: 200
    });

    marker.addListener('click', function () {
      infowindow.open(this.map, marker);
    });

    return marker;
  }

  private getUrlIcon(name: string) {
    switch (name) {
      case 'pin':
        return 'img/icons/pin.png';
      case 'udla':
        return 'img/icons/udla.png';
      case 'user':
        return 'img/icons/user.png';
      default:
        return 'img/icons/pin.png';
    }
  }

  disableMap() {
    console.log("disable map");
  }

  enableMap() {
    console.log("enable map");
    this.loader.dismiss();
  }

  addConnectivityListeners() {
    var onOnline = () => {
      setTimeout(() => {
        if (typeof google === "undefined" || typeof google.maps === "undefined") {
          this.loadGoogleMaps();
        } else {
          if (!this.mapInitialised) {
            this.initMap();
          }

          this.enableMap();
        }
      }, 2000);
    };

    var onOffline = () => {
      this.disableMap();
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
  }

  showLoading(msg) {
    this.loader = this.loadingCtrl.create({
      content: msg
    });

    this.loader.present();
  }

  presentAlert(title: string, description: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: description,
      buttons: ['OK']
    });
    alert.present();
  }
}
