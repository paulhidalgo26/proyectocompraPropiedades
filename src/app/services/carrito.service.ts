import { Injectable } from '@angular/core';
import { Pedido, Producto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

 private pedido: Pedido;

  constructor() {
    this.loadCarrito();
   }

  loadCarrito(){

  }

getCarrito(){
return this.pedido;
}

  addProductos(producto: Producto){

  }

  removePRoducto(producto: Producto){

  }

  realizarPedido(){

  }

  clearCarrito(){

  }

}
