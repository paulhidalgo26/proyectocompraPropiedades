import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


// eslint-disable-next-line no-var
declare var google: any;
@Injectable({
  providedIn: 'root'
})
export class GooglemmapsService {

apikey=environment.apikey;
maploaded=false;

  constructor() { }

  init(renderer: any, document: any): Promise<any>{
    console.log('comienza la carga del mapa');
    // eslint-disable-next-line @typescript-eslint/no-shadow
    return new Promise((resolve)=>{
      console.log(this.maploaded);
      if (this.maploaded) {
        console.log('google esta previamente cargado');
        resolve(true);
        return;
      }
      console.log('creacion del script');

      const script = renderer.createElement('script');
      script.id='googleMaps';
      console.log('creacion del parte2');
      // eslint-disable-next-line @typescript-eslint/dot-notation
      window['mapInit']=()=>{
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
        console.log('apikey',this.apikey);
        script.src='https://maps.googleapis.com/maps/api/js?key='+this.apikey+'&callback=mapInit';

      }else{
        script.src='https://maps.googleapis.com/maps/api/js?callback=mapInit';
      }

      renderer.appendChild(document.body,script);
    });
  }

   initMap() {

  }
}
