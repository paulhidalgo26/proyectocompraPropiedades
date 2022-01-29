import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente, Pedido, Producto, ProductoPedido } from '../models';
import { FireStoreService } from './fire-store.service';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

 private pedido: Pedido;
 // eslint-disable-next-line @typescript-eslint/member-ordering
 path='carrito';
 // eslint-disable-next-line @typescript-eslint/member-ordering
 uid='';
 // eslint-disable-next-line @typescript-eslint/member-ordering
 cliente: Cliente;

  constructor(public firebaseAuthService: FirebaseAuthService,
              public fireStoreService: FireStoreService,
              public route: Router) {

    this.firebaseAuthService.stateAuth().subscribe(res=>{
      console.log(res);
      if (res !== null) {
        this.uid=res.uid;
        this.loadCliente();
      }
    });
   }

  loadCarrito(){
    const path ='Clientes/'+''+this.uid+'/'+'carrito';

  this.fireStoreService.getDoc<Pedido>(path,this.uid).subscribe(res=>{
    console.log(res);
    if (res) {
      this.pedido=res;
    }else{
      this.initCarrito();
    }
  });

  }

  initCarrito(){
    this.pedido={
      id: this.uid,
      cliente: this.cliente,
      productos: [],
      precioTotal: null,
      estado: 'enviado',
      fecha: new Date(),
      valoracion: null,
    };
  }

  loadCliente(){
    const path='Clientes';
    this.fireStoreService.getDoc<Cliente>(path,this.uid).subscribe(res=>{
      this.cliente=res ;
      this.loadCarrito();
    });
  }

getCarrito(){
return this.pedido;
}

  addProductos(producto: Producto){
    if (this.uid.length) {
        // eslint-disable-next-line arrow-body-style
       const item= this.pedido.productos.find(productoPedido=>{
          return (productoPedido.producto.id===producto.id);
        });
        if (item!== undefined) {
            item.cantidad++;
        }else{
          const add: ProductoPedido={
            cantidad:1,
            producto,
          };
          this.pedido.productos.push(add);
        }
    }else{
        this.route.navigate(['/perfil']);
        return;
    }
    console.log('en add pedido => ', this.pedido);
    const path ='Clientes/'+''+this.uid+'/'+'carrito';
    this.fireStoreService.createDoc(this.pedido,path,this.uid).then(()=>{
        console.log('añdido con exito');
    });
  }

  removePRoducto(producto: Producto){

  }

  realizarPedido(){

  }

  clearCarrito(){

  }

}
