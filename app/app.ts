import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { AcercadePage } from './pages/acercade/acercade';
import { MapaPage } from './pages/mapa/mapa';
import { ServiciosPage } from './pages/servicios/servicios';

import { ConnectivityService } from './providers/connectivity-service/connectivity-service';

@Component({
  templateUrl: 'build/app.html',
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ServiciosPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Contactos', component: ServiciosPage },
      { title: 'Mapa', component: MapaPage },
      { title: 'Información', component: AcercadePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp, [ConnectivityService]);
