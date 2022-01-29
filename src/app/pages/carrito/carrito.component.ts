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
       this.loadPedido();
     }

  ngOnInit() {}

 openMenu(){
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }
  loadPedido(){
     this.pedido= this.carritoService.getCarrito();
  }
}
