import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Pedido } from 'src/app/models';
import { FireStoreService } from 'src/app/services/fire-store.service';
import {CarritoService} from 'src/app/services/carrito.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit {

  pedido: Pedido;
  constructor(public menucontroler: MenuController,
    public fireStoreService: FireStoreService,
    public carritoService: CarritoService) {

      this.initCarrito();
       this.loadPedidos();
       console.log('funciona');
     }

  ngOnInit() {}

 openMenu(){
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }
  loadPedidos(){
  this.carritoService.getCarrito().subscribe(res=>{
    console.log(res,'respuesta');
    this.pedido=res;
  });
  }
  initCarrito(){
    this.pedido={
      id: '',
      cliente: null,
      productos: [],
      precioTotal: null,
      estado: 'enviado',
      fecha: new Date(),
      valoracion: null,
    };
  }
}
