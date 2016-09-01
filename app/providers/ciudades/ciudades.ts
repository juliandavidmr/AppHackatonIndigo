import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage, LocalStorage } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { ConnectivityService } from '../../providers/connectivity-service/connectivity-service';

import { URL_API } from '../config';
/*
  Generated class for the Servicios provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Ciudades {

  data: any;
  local: any;

  constructor(private http: Http,
    private connectivity: ConnectivityService) {
    this.local = new Storage(LocalStorage);
    this.data = null;
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    if (this.connectivity.isOnline()) {
      // don't have the data yet
      return new Promise(resolve => {
        // We're using Angular Http provider to request the data,
        // then on the response it'll map the JSON data to a parsed JS object.
        // Next we process the data and resolve the promise with the new data.
        this.http.get(URL_API + 'ciudades')
          .map(res => res.json())
          .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            this.local.set('ciudades', JSON.stringify(data));
            this.data = data;
            resolve(this.data);
          });
      });
    } else {
      return new Promise(resolve => {
        this.local.get('ciudades').then(data => {
          this.data = JSON.parse(data);
          resolve(this.data);
        });
      });
    }
  }
}

