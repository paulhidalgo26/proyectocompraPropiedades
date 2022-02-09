import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GooglemapsComponent } from 'src/app/googlemaps/googlemaps.component';
import { CarritoService } from 'src/app/services/carrito.service';
import {ProductoPedido} from '../../models';

@Component({
  selector: 'app-itemcarrito',
  templateUrl: './itemcarrito.component.html',
  styleUrls: ['./itemcarrito.component.scss'],
})
export class ItemcarritoComponent implements OnInit {

@Input() productoPedido: ProductoPedido;
@Input() botones=true;


  constructor(public carritoService: CarritoService,
    public modalController: ModalController) { }

  ngOnInit() {}

  // addCarrito(){
  //   this.carritoService.addProductos(this.productoPedido.producto);
  // }
  removeCarrito(){
    this.carritoService.removeProducto(this.productoPedido.producto);
  }
  async  verubicacion(){
      const ubicacion=this.productoPedido.producto.ubicacion;
      // eslint-disable-next-line prefer-const
      console.log('posicion por defecto', ubicacion);
      const modalAdd = await this.modalController.create({
        component: GooglemapsComponent,
        mode: 'ios',
        swipeToClose:true,
        componentProps: {posicion: ubicacion}
      });
      await modalAdd.present();
      const {data}=await modalAdd.onWillDismiss();
    }
}
