import { Component, Input, OnInit } from '@angular/core';
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


  constructor(public carritoService: CarritoService) { }

  ngOnInit() {}

  // addCarrito(){
  //   this.carritoService.addProductos(this.productoPedido.producto);
  // }
  removeCarrito(){
    this.carritoService.removeProducto(this.productoPedido.producto);
  }
}
