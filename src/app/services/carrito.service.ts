import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';

import { Cliente, Compra, ProductoPedido, Propiedad } from '../models';
import { FireStoreService } from './fire-store.service';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

 private propiedad: Compra;
 // eslint-disable-next-line @typescript-eslint/member-ordering
 path='carrito';
 // eslint-disable-next-line @typescript-eslint/member-ordering
 uid='';
 // eslint-disable-next-line @typescript-eslint/member-ordering
 cliente: Cliente;
 // eslint-disable-next-line @typescript-eslint/member-ordering
 propiedad$ = new Subject<Compra>();
 // eslint-disable-next-line @typescript-eslint/member-ordering
 cariitosuscriber: Subscription;
 // eslint-disable-next-line @typescript-eslint/member-ordering
 clientesuscriber: Subscription;

  constructor(public firebaseAuthService: FirebaseAuthService,
              public fireStoreService: FireStoreService,
              public route: Router) {
                this.initCarrito();
                  this.clientesuscriber= this.firebaseAuthService.stateAuth().subscribe(res=>{
                    console.log(res);
                    if (res !== null) {
                      this.uid=res.uid;
                      this.loadCliente();
                    }else{
                    }
                  });
   }

  loadCarrito(){
    const path ='Clientes/'+this.uid+'/'+'carrito';
 this.cariitosuscriber= this.fireStoreService.getDoc<Compra>(path,this.uid).subscribe(res=>{
    if (res) {
      this.propiedad=res;

      this. propiedad$.next(this.propiedad);
    }else{
      this.initCarrito();
    }
  });

  }

  initCarrito(){
    this.propiedad={
      id: this.uid,
      cliente: this.cliente,
      productos: [],
      estado: 'visto',
      fecha: new Date(),
    };
    this.propiedad$.next(this.propiedad);
  }


  loadCliente(){
    const path='Clientes';
    this.fireStoreService.getDoc<Cliente>(path,this.uid).subscribe(res=>{
      this.cliente=res ;
      this.loadCarrito();
    });
  }

getCarrito(): Observable<Compra>{
  setTimeout(()=>{
    this.propiedad$.next(this.propiedad);
  },100);
 return this.propiedad$.asObservable();
}

addProductos(propiedad: Propiedad){
    if (this.uid.length) {
        // eslint-disable-next-line arrow-body-style
       const item= this.propiedad.productos.find(productoPedido=>{
          return (productoPedido.producto.id===propiedad.id);
        });
        if (item!== undefined) {
            //poner mensaje de producto ya esta en compras
        }else{
          const add: ProductoPedido={
            producto: propiedad
          };
          this.propiedad.productos.push(add);
        }
    }else{
        this.route.navigate(['/perfil']);
        return;
    }
    this.propiedad$.next(this.propiedad);
    console.log('en add pedido => ', this.propiedad);
    const path ='Clientes/'+this.uid+'/'+'carrito';
    this.fireStoreService.createDoc(this.propiedad,path,this.uid).then(()=>{
        console.log('añdido con exito');
        this.route.navigate(['/carrito']);
    });
  }

  removeProducto(producto: Propiedad){
    if (this.uid.length) {
      let pocision=0;
      const item= this.propiedad.productos.find((productoPedido , index)=>{
          pocision=index;
          return(productoPedido.producto.id===producto.id);
      });
      if (item !==undefined) {
        this.propiedad.productos.splice(pocision, 1);
        console.log('app remove pedido ',this.propiedad);
        const path='Clientes/' + this.uid +'/'+this.path;
        this.fireStoreService.createDoc(this.propiedad,path,this.uid).then(()=>{
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
