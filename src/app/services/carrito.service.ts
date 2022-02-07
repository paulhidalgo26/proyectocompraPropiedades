import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';

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
 // eslint-disable-next-line @typescript-eslint/member-ordering
 pedido$ = new Subject<Pedido>();
 // eslint-disable-next-line @typescript-eslint/member-ordering
 cariitosuscriber: Subscription;
 // eslint-disable-next-line @typescript-eslint/member-ordering
 clientesuscriber: Subscription;

  constructor(public firebaseAuthService: FirebaseAuthService,
              public fireStoreService: FireStoreService,
              public route: Router) {
                this.initCarrito();
                setTimeout(() => {
                  this.clientesuscriber= this.firebaseAuthService.stateAuth().subscribe(res=>{
                    console.log(res,);
                    if (res !== null) {
                      this.uid=res.uid;
                      this.loadCliente();
                    }else{
                    //   if (this.clientesuscriber) {
                    //     this.clientesuscriber.unsubscribe();
                    //  }
                    //  if (this.cariitosuscriber) {
                    //   this.cariitosuscriber.unsubscribe();
                    //  }
                    }
                  });
                },100);
   }


  loadCarrito(){
    const path ='Clientes/'+this.uid+'/'+'carrito';
 this.cariitosuscriber= this.fireStoreService.getDoc<Pedido>(path,this.uid).subscribe(res=>{
    if (res) {
      this.pedido=res;

      this.pedido$.next(this.pedido);
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
    this.pedido$.next(this.pedido);
  }


  loadCliente(){
    const path='Clientes';
    this.fireStoreService.getDoc<Cliente>(path,this.uid).subscribe(res=>{
      this.cliente=res ;
      this.loadCarrito();
    });
  }

getCarrito(): Observable<Pedido>{
  setTimeout(()=>{
    this.pedido$.next(this.pedido);
  },100);
 return this.pedido$.asObservable();
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
    this.pedido$.next(this.pedido);
    console.log('en add pedido => ', this.pedido);
    const path ='Clientes/'+this.uid+'/'+'carrito';
    this.fireStoreService.createDoc(this.pedido,path,this.uid).then(()=>{
        console.log('añdido con exito');
    });
  }

  removeProducto(producto: Producto){
    if (this.uid.length) {
      let pocision=0;
      const item= this.pedido.productos.find((productoPedido , index)=>{
          pocision=index;
          return(productoPedido.producto.id===producto.id);
      });
      if (item !==undefined) {
        item.cantidad --;
        if (item.cantidad===0) {
          this.pedido.productos.splice(pocision, 1);
        }
        console.log('app remove pedido ',this.pedido);
        const path='Clientes/' + this.uid +'/'+this.path;
        this.fireStoreService.createDoc(this.pedido,path,this.uid).then(()=>{
          console.log('removido  con exito');
        });
      }
  }
  }

  realizarPedido(){

  }

  clearCarrito(){
    const path='Clientes/' + this.uid +'/'+'carrito';
    this.fireStoreService.deleteDoc(path,this.uid).then(()=>{
      //this.initCarrito();
    });

  }



}
