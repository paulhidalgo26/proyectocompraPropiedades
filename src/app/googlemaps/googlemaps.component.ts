/* eslint-disable prefer-const */
import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { GooglemmapsService } from './googlemmaps.service';
// eslint-disable-next-line @typescript-eslint/naming-convention
const { Geolocation } = Plugins;
// eslint-disable-next-line no-var
declare var google: any;




@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.scss'],
})
export class GooglemapsComponent implements OnInit {
  @Input() posicion: any;

  label={
    titulo: 'Ubicacion',
    subtitulo: 'ubicaccion de la propiedad'
  };

  map: any;
  marker: any;
  infowindow: any;
  positionset: any;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild('map') divMap: ElementRef;





  constructor(private renderer: Renderer2,
              @Inject(DOCUMENT) private document,
              public googlemmapsService: GooglemmapsService,
              public modalController: ModalController ) { }

  ngOnInit() {
this.init();
  }
  init(){
this.googlemmapsService.init(this.renderer,this.document).then(()=>{
  this.initMap();
}).catch((err)=>{
  console.log(err,'error faltal');
});
  }

  initMap(){
    console.log('comienza la carga del mapa');
    const position= this.posicion;
    console.log('posicion',this.posicion);

    const coords = new google.maps.LatLng(this.posicion.lat,this.posicion.lng);
    //let latLng=new google.maps.Latlng(position.lat,position.lng);
    console.log('goglpe position');
    const mapProp={
        center: coords,
        zoom: 14,
        disableDefaultUI: true,
        clickableIcons: false,
    };
    this.map= new google.maps.Map(this.divMap.nativeElement,mapProp);
  //this.map= new google.maps.Map(document.getElementById('map'),mapProp);
    console.log('el mapa');
    this.marker= new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: true,
    });
    console.log('el marcador para el mapa', this.marker);
    this.clickHandleEvent();
    this.infowindow= new google.maps.InfoWindow();
      console.log(position,'posiscion para enviar');
      this.addMarker(position);

      this.setInfoWindow(this.marker,this.label.titulo,this.label.subtitulo);
  }


clickHandleEvent(){
  console.log('comienzo del handler');
this.map.addListener('click',(event: any)=>{
  // eslint-disable-next-line @typescript-eslint/naming-convention
const NewPosicio={
 lat: event.latLng.lat(),
lng: event.latLng.lng(),
};
console.log(' handler',NewPosicio);
this.addMarker(NewPosicio);
});

  }


  addMarker(posicionR: any){
    console.log(posicionR,'psicion recivida');
   // const latLng = new google.maps.latLng(posicionR.lat,posicionR.lng);
    this.marker.setPosition(posicionR);
    this.map.panTo(posicionR);
    this.positionset=posicionR;
    console.log(this.positionset);
  }

  setInfoWindow(marker: any , titulo: string , subtitulo: string){
    console.log(this.marker,'marcador recivido',this.label.titulo);
      const contentString='<div id="contentInsideMap">' +
                          '<div>'+
                          '</div>'+
                          '<div>'+
                          '<p class="normal m-8">'+ titulo+'</p>'+
                          '</div>'+
                          '</div>';
console.log('datos de informacion');
this.infowindow.setContent(contentString);
console.log('informacion enviada',this.infowindow);
this.infowindow.open(this.map,marker);
  }

  mylocation(){
    console.log('mylocate() click');
    Geolocation.getCurrentPosition().then(res=>{
      console.log('my location() => get');
      const position={
        lat: res.coords.latitude,
        lng: res.coords.longitude,
      };
      this.addMarker(position);
    });
  }

  aceptar(){
    console.log('click aceptar =>',this.posicion);
    this.modalController.dismiss({pos: this.positionset});
  }
}
