import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import { promise } from 'protractor';
// eslint-disable-next-line no-var
declare var google: any;
@Injectable({
  providedIn: 'root'
})
export class GooglemmapsService {

apikey='AIzaSyDNHcU45pFescHsNYfa62hSpKWGBQ8XJfU';
maploaded=false;

  constructor() { }

  init(renderer: any, document: any): Promise<any>{
    // eslint-disable-next-line @typescript-eslint/no-shadow
    return new Promise((resolve)=>{
      if (this.maploaded) {
        console.log('google esta previamente cargado');
        resolve(true);
        return;
      }
      const script = renderer.create('script');
      script.id='googleMaps';
      // eslint-disable-next-line @typescript-eslint/dot-notation
      window['initMap']=()=>{
        this.maploaded=true;
        if (google) {
          console.log('google esta caragado');
        }else{
          console.log('goolge no esta definido');
        }
        resolve(true);
        return;
      };
      if (this.apikey) {
        script.src='https://maps.googleapis.com/maps/api/js?key=AIzaSyDNHcU45pFescHsNYfa62hSpKWGBQ8XJfU&callback=initMap';

      }else{
        script.src='https://maps.googleapis.com/maps/api/js?callback=initMap';
      }

      renderer.appendChild(document.body,script);
    });
  }
}
