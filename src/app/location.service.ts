import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(
    private apiloader: MapsAPILoader,
  ) { }

  get = (): Observable<any> => {
    return new Observable((observer) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          if (position) {
            try {
              const addr = await this.decoding(position.coords.latitude, position.coords.longitude);
              observer.next(addr ? addr : '');
              return;
            } catch (err) {
              observer.error(err);
            }
          }
        });
      } else {
        observer.error('Not supported');
      }
    });
  }
  decoding = (latitude: number, longitude: number) => {
    return new Promise((resolve, reject) => {
      this.apiloader.load().then(() => {
        const geocoder = new google.maps.Geocoder();
        const latlng = {
          lat: latitude ? latitude : null,
          lng: longitude ? longitude : null
        };
        geocoder.geocode({ location: latlng }, (results) => {
          if (results && results.length > 0) {
            resolve(results[0].formatted_address);
          } else {
            reject('Not found');
          }
        });
      });
    });
  }
  getLocationFromLatLng = (latitude: number, longitude: number) => {
    return new Observable((observer) => {
      this.apiloader.load().then(() => {
        const geocoder = new google.maps.Geocoder();
        const latlng = {
          lat: latitude ? latitude : null,
          lng: longitude ? longitude : null
        };
        geocoder.geocode({ location: latlng }, (results) => {
          if (results && results.length > 0) {
            observer.next(results[0].formatted_address);
          } else {
            observer.error('Not found');
          }
        });
      });
    });
  }
}
