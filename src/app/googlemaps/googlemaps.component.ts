/* eslint-disable prefer-const */
import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { inject } from '@angular/core/testing';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { GooglemmapsService } from './googlemmaps.service';

// eslint-disable-next-line no-var
declare var google: any;

// eslint-disable-next-line @typescript-eslint/naming-convention
const {Geolocation}=Plugins;

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.scss'],
})
export class GooglemapsComponent implements OnInit {
  @Input() position={
    lat:-2.898116,
    lng: -78.9995814999
  };

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
              private googlemmapsService: GooglemmapsService,
              public modalController: ModalController ) { }

  ngOnInit() {
this.init();
  }
  init(){
this.googlemmapsService.init(this.renderer,this.document).then(()=>{
  this.initMap();
}).catch((err)=>{
  console.log(err);
});
  }

  initMap(){
    const position= this.position;
    let latLng=new google.maps.latLng(position.lat,position.lng);
    let mapOotions={
        center: latLng,
        zoom: 15,
        disableDefaultUI: true,
        clickableIcons: false,
    };
    this.map= new google.maps.Map(this.divMap.nativeElement,mapOotions);
    this.marker= new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: true,
    });

    this.clickHandleEvent();
    this.infowindow= new google.maps.infowindow();
    if (this.label.titulo.length) {
      this.addMarker(position);
      this.setInfoWindow(this.marker,this.label.titulo,this.label.subtitulo);
    }
  }


  clickHandleEvent(){
this.map.addListener('click',(event: any)=>{
const position={
  lat: event.latLng.lat(),
  lng: event.latLng.lng(),
};
this.addMarker(position);
});

  }


  addMarker(position: any): void{
    let latLng = new google.maps.latLng(position.lat,position.lng);

    this.marker.setPosition(latLng);
    this.map.panto(position);
    this.positionset=position;
  }

  setInfoWindow(marker: any , titulo: string , subtitulo: string){
      const contentString='<div id="contentInsideMap">' +
                          '<div>'+
                          '</div>'+
                          '<p style="font-weight:bool; margin-botton:5px;"></p>'+
                          '<div>'+
                          '<p class="normal m-8">'+ subtitulo+'</p>'+
                          '</div>'+
                          '</div>';
this.infowindow.setContent(contentString);
this.infowindow.apen(this.map,marker);
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
    console.log('click aceptar =>',this.position);
    this.modalController.dismiss({pos: this.positionset});
  }
}
